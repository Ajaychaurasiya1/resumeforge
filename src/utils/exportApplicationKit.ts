import JSZip from 'jszip'
import type { CoverLetterData, ResumeData } from '../types/resume'
import { emptyCoverLetter } from '../types/resume'
import { buildCoverLetterDocxBlob } from './exportCoverLetterDocx'
import { buildResumeDocxBlob } from './exportDocx'
import { buildApplicationPdfBlob } from './exportTextPdf'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportApplicationPdf(data: ResumeData, filename?: string) {
  downloadBlob(
    buildApplicationPdfBlob(data),
    filename ?? `${data.personalInfo.fullName || 'application'}-kit.pdf`,
  )
}

export async function exportApplicationKitZip(
  data: ResumeData,
  coverLetter?: CoverLetterData,
  options?: { includeReferences?: boolean },
): Promise<void> {
  const letter = coverLetter?.body.trim() ? coverLetter : data.coverLetter ?? emptyCoverLetter()
  const kitData = { ...data, coverLetter: letter }
  const baseName = (data.personalInfo.fullName || 'application').replace(/\s+/g, '-').toLowerCase()
  const zip = new JSZip()

  zip.file(`${baseName}-application.pdf`, buildApplicationPdfBlob(kitData))
  zip.file(`${baseName}-resume.docx`, await buildResumeDocxBlob(data))
  zip.file(`${baseName}-cover-letter.docx`, await buildCoverLetterDocxBlob(data, letter))

  if (options?.includeReferences !== false && data.references.some((r) => r.name)) {
    const refsText = data.references
      .filter((r) => r.name)
      .map((r) => {
        const parts = [r.name, r.title, r.company, r.email, r.phone].filter(Boolean)
        return parts.join(' · ')
      })
      .join('\n\n')
    zip.file(`${baseName}-references.txt`, refsText)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, `${baseName}-application-kit.zip`)
}
