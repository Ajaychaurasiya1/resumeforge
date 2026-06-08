import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx'
import type { ResumeData } from '../types/resume'
import { getPersonalContactLine, getPersonalSubtitle } from './personalInfo'
import { formatSkillsForExport, hasSkillContent } from './skills'

function heading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  })
}

function body(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun(text)],
    spacing: { after: 120 },
  })
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 60 },
  })
}

export async function exportDocx(data: ResumeData, filename = 'resume.docx'): Promise<void> {
  const { personalInfo, summary, experience, education, skillCategories } = data
  const children: Paragraph[] = []

  const contactParts = [
    personalInfo.fullName,
    getPersonalSubtitle(personalInfo),
    getPersonalContactLine(personalInfo),
  ].filter(Boolean)

  if (contactParts.length) {
    children.push(heading('Personal Information'))
    children.push(body(contactParts.join(' | ')))
  }

  if (summary.trim()) {
    children.push(heading('Summary'))
    children.push(body(summary.trim()))
  }

  const filledExperience = experience.filter((e) => e.company || e.position)
  if (filledExperience.length) {
    children.push(heading('Experience'))
    for (const job of filledExperience) {
      const title = [job.position, job.company].filter(Boolean).join(' — ')
      const dates = [job.startDate, job.current ? 'Present' : job.endDate]
        .filter(Boolean)
        .join(' – ')
      const meta = [title, dates, job.location].filter(Boolean).join(' | ')
      if (meta) children.push(body(meta))

      const bullets = job.description
        .split('\n')
        .map((line) => line.replace(/^[-•*●○▪►]\s*/, '').trim())
        .filter(Boolean)

      for (const line of bullets) {
        children.push(bullet(line))
      }
    }
  }

  const filledEducation = education.filter((e) => e.institution || e.degree)
  if (filledEducation.length) {
    children.push(heading('Education'))
    for (const edu of filledEducation) {
      const line = [
        [edu.degree, edu.field].filter(Boolean).join(' in '),
        edu.institution,
        [edu.startDate, edu.endDate].filter(Boolean).join(' – '),
        edu.gpa ? `GPA: ${edu.gpa}` : '',
      ]
        .filter(Boolean)
        .join(' | ')
      children.push(body(line))
    }
  }

  if (hasSkillContent(skillCategories)) {
    children.push(heading('Skills'))
    children.push(body(formatSkillsForExport(skillCategories)))
  }

  const doc = new Document({
    sections: [{ children }],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function buildResumeDocxBlob(data: ResumeData): Promise<Blob> {
  const { personalInfo, summary, experience, education, skillCategories } = data
  const children: Paragraph[] = []

  const contactParts = [
    personalInfo.fullName,
    getPersonalSubtitle(personalInfo),
    getPersonalContactLine(personalInfo),
  ].filter(Boolean)

  if (contactParts.length) {
    children.push(heading('Personal Information'))
    children.push(body(contactParts.join(' | ')))
  }

  if (summary.trim()) {
    children.push(heading('Summary'))
    children.push(body(summary.trim()))
  }

  const filledExperience = experience.filter((e) => e.company || e.position)
  if (filledExperience.length) {
    children.push(heading('Experience'))
    for (const job of filledExperience) {
      const title = [job.position, job.company].filter(Boolean).join(' — ')
      const dates = [job.startDate, job.current ? 'Present' : job.endDate]
        .filter(Boolean)
        .join(' – ')
      const meta = [title, dates, job.location].filter(Boolean).join(' | ')
      if (meta) children.push(body(meta))

      const bullets = job.description
        .split('\n')
        .map((line) => line.replace(/^[-•*●○▪►]\s*/, '').trim())
        .filter(Boolean)

      for (const line of bullets) {
        children.push(bullet(line))
      }
    }
  }

  const filledEducation = education.filter((e) => e.institution || e.degree)
  if (filledEducation.length) {
    children.push(heading('Education'))
    for (const edu of filledEducation) {
      const line = [
        [edu.degree, edu.field].filter(Boolean).join(' in '),
        edu.institution,
        [edu.startDate, edu.endDate].filter(Boolean).join(' – '),
        edu.gpa ? `GPA: ${edu.gpa}` : '',
      ]
        .filter(Boolean)
        .join(' | ')
      children.push(body(line))
    }
  }

  if (hasSkillContent(skillCategories)) {
    children.push(heading('Skills'))
    children.push(body(formatSkillsForExport(skillCategories)))
  }

  const doc = new Document({ sections: [{ children }] })
  return Packer.toBlob(doc)
}
