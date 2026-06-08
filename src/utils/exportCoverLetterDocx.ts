import { Document, Packer, Paragraph, TextRun } from 'docx'
import type { CoverLetterData, ResumeData } from '../types/resume'

function body(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun(text)],
    spacing: { after: 200 },
  })
}

export async function exportCoverLetterDocx(
  data: ResumeData,
  letter: CoverLetterData,
  filename = 'cover-letter.docx',
): Promise<void> {
  const { personalInfo } = data
  const children: Paragraph[] = []

  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: personalInfo.fullName, bold: true, size: 28 })],
        spacing: { after: 100 },
      }),
    )
  }

  const contact = [personalInfo.email, personalInfo.phone, personalInfo.location]
    .filter(Boolean)
    .join(' · ')
  if (contact) children.push(body(contact))

  if (letter.date) children.push(body(letter.date))

  const recipient = [letter.recipientName, letter.recipientTitle, letter.companyName]
    .filter(Boolean)
    .join('\n')
  if (recipient) children.push(body(recipient))

  if (letter.subject) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Re: ${letter.subject}`, bold: true })],
        spacing: { before: 200, after: 200 },
      }),
    )
  }

  for (const para of letter.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)) {
    children.push(body(para))
  }

  const doc = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function buildCoverLetterDocxBlob(
  data: ResumeData,
  letter: CoverLetterData,
): Promise<Blob> {
  const { personalInfo } = data
  const children: Paragraph[] = []

  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: personalInfo.fullName, bold: true, size: 28 })],
        spacing: { after: 100 },
      }),
    )
  }

  const contact = [personalInfo.email, personalInfo.phone, personalInfo.location]
    .filter(Boolean)
    .join(' · ')
  if (contact) children.push(body(contact))

  if (letter.date) children.push(body(letter.date))

  const recipient = [letter.recipientName, letter.recipientTitle, letter.companyName]
    .filter(Boolean)
    .join('\n')
  if (recipient) children.push(body(recipient))

  if (letter.subject) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Re: ${letter.subject}`, bold: true })],
        spacing: { before: 200, after: 200 },
      }),
    )
  }

  for (const para of letter.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)) {
    children.push(body(para))
  }

  const doc = new Document({ sections: [{ children }] })
  return Packer.toBlob(doc)
}
