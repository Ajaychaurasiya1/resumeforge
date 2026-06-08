import { jsPDF } from 'jspdf'
import type { CoverLetterData, ResumeData } from '../types/resume'
import { SECTION_LABELS, isCoreSectionId } from '../types/resume'
import { getOrderedResumeSections } from './sectionConfig'
import { getPersonalContactLine, getPersonalSubtitle } from './personalInfo'
import { formatSkillsForExport, hasSkillContent } from './skills'

const MARGIN = 20
const PAGE_BOTTOM = 285

function splitBullets(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-•*●○▪►]\s*/, '').trim())
    .filter(Boolean)
}

function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_BOTTOM) {
    pdf.addPage()
    return MARGIN
  }
  return y
}

function writeLines(
  pdf: jsPDF,
  y: number,
  text: string,
  fontSize: number,
  style: 'normal' | 'bold' | 'italic' = 'normal',
  maxWidth?: number,
): number {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const width = maxWidth ?? pageWidth - MARGIN * 2
  pdf.setFontSize(fontSize)
  pdf.setFont('helvetica', style)
  const lines = pdf.splitTextToSize(text, width) as string[]
  const lineHeight = fontSize * 0.45

  for (const line of lines) {
    y = ensureSpace(pdf, y, lineHeight + 2)
    pdf.text(line, MARGIN, y)
    y += lineHeight + 1
  }
  return y + 2
}

function writeSectionHeading(pdf: jsPDF, y: number, title: string): number {
  y = ensureSpace(pdf, y, 14)
  y = writeLines(pdf, y, title.toUpperCase(), 11, 'bold')
  pdf.setDrawColor(180)
  pdf.line(MARGIN, y - 2, pdf.internal.pageSize.getWidth() - MARGIN, y - 2)
  return y + 2
}

function renderResumeContent(pdf: jsPDF, data: ResumeData, startY: number): number {
  let y = startY
  const { personalInfo, summary, settings } = data

  y = writeLines(pdf, y, personalInfo.fullName || 'Your Name', 18, 'bold')
  const subtitle = getPersonalSubtitle(personalInfo)
  if (subtitle) y = writeLines(pdf, y, subtitle, 11, 'normal')
  const contact = getPersonalContactLine(personalInfo)
  if (contact) y = writeLines(pdf, y, contact, 10, 'normal')
  y += 4

  if (summary.trim()) {
    y = writeSectionHeading(pdf, y, 'Summary')
    y = writeLines(pdf, y, summary.trim(), 10)
  }

  const sectionOrder = getOrderedResumeSections(data)

  for (const sectionId of sectionOrder) {
    if (!isCoreSectionId(sectionId)) continue
    if (settings.hiddenSections.includes(sectionId)) continue

    switch (sectionId) {
      case 'summary':
        break
      case 'skills': {
        if (!hasSkillContent(data.skillCategories)) break
        y = writeSectionHeading(pdf, y, SECTION_LABELS.skills)
        y = writeLines(pdf, y, formatSkillsForExport(data.skillCategories), 10)
        break
      }
      case 'experience': {
        const jobs = data.experience.filter((e) => e.company || e.position)
        if (!jobs.length) break
        y = writeSectionHeading(pdf, y, SECTION_LABELS.experience)
        for (const job of jobs) {
          const title = [job.position, job.company].filter(Boolean).join(' — ')
          const dates = [job.startDate, job.current ? 'Present' : job.endDate]
            .filter(Boolean)
            .join(' – ')
          y = writeLines(pdf, y, title, 11, 'bold')
          if (dates || job.location) {
            y = writeLines(pdf, y, [dates, job.location].filter(Boolean).join(' · '), 9, 'italic')
          }
          for (const bullet of splitBullets(job.description)) {
            y = writeLines(pdf, y, `• ${bullet}`, 10)
          }
          y += 2
        }
        break
      }
      case 'projects': {
        const projects = data.projects.filter((p) => p.name)
        if (!projects.length) break
        y = writeSectionHeading(pdf, y, SECTION_LABELS.projects)
        for (const p of projects) {
          y = writeLines(pdf, y, p.name, 11, 'bold')
          if (p.technologies) y = writeLines(pdf, y, p.technologies, 9, 'italic')
          if (p.description) y = writeLines(pdf, y, p.description, 10)
          y += 1
        }
        break
      }
      case 'education': {
        const edu = data.education.filter((e) => e.institution || e.degree)
        if (!edu.length) break
        y = writeSectionHeading(pdf, y, SECTION_LABELS.education)
        for (const e of edu) {
          const line = [[e.degree, e.field].filter(Boolean).join(' in '), e.institution]
            .filter(Boolean)
            .join(' — ')
          y = writeLines(pdf, y, line, 10, 'bold')
          const meta = [
            [e.startDate, e.endDate].filter(Boolean).join(' – '),
            e.gpa ? `GPA: ${e.gpa}` : '',
          ]
            .filter(Boolean)
            .join(' · ')
          if (meta) y = writeLines(pdf, y, meta, 9)
        }
        break
      }
      case 'certifications': {
        const certs = data.certifications.filter((c) => c.name)
        if (!certs.length) break
        y = writeSectionHeading(pdf, y, SECTION_LABELS.certifications)
        for (const c of certs) {
          y = writeLines(
            pdf,
            y,
            [c.name, c.issuer, c.date].filter(Boolean).join(' · '),
            10,
          )
        }
        break
      }
      case 'achievements': {
        const items = data.achievements.filter((a) => a.title)
        if (!items.length) break
        y = writeSectionHeading(pdf, y, SECTION_LABELS.achievements)
        for (const a of items) {
          y = writeLines(
            pdf,
            y,
            [a.title, a.organization, a.date].filter(Boolean).join(' · '),
            10,
            'bold',
          )
          if (a.description) y = writeLines(pdf, y, a.description, 10)
        }
        break
      }
      case 'languages': {
        const langs = data.languages.filter((l) => l.name)
        if (!langs.length) break
        y = writeSectionHeading(pdf, y, SECTION_LABELS.languages)
        y = writeLines(
          pdf,
          y,
          langs.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(', '),
          10,
        )
        break
      }
      default:
        break
    }
  }

  for (const custom of data.customSections) {
    if (!custom.title && !custom.items.length) continue
    y = writeSectionHeading(pdf, y, custom.title || 'Custom Section')
    for (const item of custom.items) {
      if (item.title) y = writeLines(pdf, y, item.title, 10, 'bold')
      if (item.description) y = writeLines(pdf, y, item.description, 10)
    }
  }

  return y
}

export function exportTextPdf(data: ResumeData, filename = 'resume.pdf'): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  renderResumeContent(pdf, data, MARGIN)
  pdf.save(filename)
}

export function exportCoverLetterPdf(
  data: ResumeData,
  letter: CoverLetterData,
  filename = 'cover-letter.pdf',
): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = MARGIN
  const { personalInfo } = data

  y = writeLines(pdf, y, personalInfo.fullName || 'Your Name', 14, 'bold')
  const senderContact = [personalInfo.email, personalInfo.phone, personalInfo.location]
    .filter(Boolean)
    .join(' · ')
  if (senderContact) y = writeLines(pdf, y, senderContact, 10)
  y += 6

  if (letter.date) y = writeLines(pdf, y, letter.date, 10)
  y += 4

  const recipient = [
    letter.recipientName,
    letter.recipientTitle,
    letter.companyName,
  ]
    .filter(Boolean)
    .join('\n')
  if (recipient) y = writeLines(pdf, y, recipient, 10)
  y += 6

  if (letter.subject) {
    y = writeLines(pdf, y, `Re: ${letter.subject}`, 10, 'bold')
    y += 4
  }

  const paragraphs = letter.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  for (const para of paragraphs) {
    y = writeLines(pdf, y, para, 11)
    y += 3
  }

  pdf.save(filename)
}

export function buildApplicationPdfBlob(data: ResumeData): Blob {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = renderResumeContent(pdf, data, MARGIN)

  if (data.coverLetter?.body.trim()) {
    pdf.addPage()
    y = MARGIN
    y = writeSectionHeading(pdf, y, 'Cover Letter')
    const { personalInfo } = data
    const letter = data.coverLetter

    if (letter.subject) y = writeLines(pdf, y, letter.subject, 11, 'bold')
    y += 2

    const recipient = [letter.recipientName, letter.companyName].filter(Boolean).join(', ')
    if (recipient) y = writeLines(pdf, y, `To: ${recipient}`, 10)
    y += 4

    for (const para of letter.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)) {
      y = writeLines(pdf, y, para, 11)
      y += 3
    }

    if (personalInfo.fullName) {
      y += 4
      y = writeLines(pdf, y, personalInfo.fullName, 11, 'bold')
    }
  }

  const refs = data.references.filter((r) => r.name)
  if (refs.length > 0) {
    pdf.addPage()
    y = MARGIN
    y = writeSectionHeading(pdf, y, 'References')
    for (const ref of refs) {
      const line = [ref.name, ref.title, ref.company, ref.email, ref.phone].filter(Boolean).join(' · ')
      y = writeLines(pdf, y, line, 10)
    }
  }

  return pdf.output('blob')
}

export function exportResumeAndCoverLetterPdf(
  data: ResumeData,
  filename = 'application.pdf',
): void {
  const blob = buildApplicationPdfBlob(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
