import { migrateResumeData } from './migrate'
import { parseResumeFromText } from './parseResumeText'
import { extractTextFromPdf } from './extractPdfText'
import { extractDocxText } from './extractDocxText'
import { isLikelyLinkedInPaste, parseLinkedInText } from './linkedinParse'
import { defaultResumeData, type ResumeData } from '../types/resume'

export type ImportFormat = 'json' | 'pdf' | 'docx' | 'text'

export function importTextContent(text: string): ResumeData {
  const trimmed = text.trim()
  if (!trimmed) throw new Error('No text provided.')

  if (isLikelyLinkedInPaste(trimmed)) {
    const patch = parseLinkedInText(trimmed)
    return migrateResumeData({ ...defaultResumeData(), ...patch })
  }

  return parseResumeFromText(trimmed)
}

export function getImportFormat(file: File): ImportFormat | null {
  const name = file.name.toLowerCase()
  if (name.endsWith('.json')) return 'json'
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx')) return 'docx'
  if (name.endsWith('.txt') || name.endsWith('.text')) return 'text'
  if (file.type === 'application/json') return 'json'
  if (file.type === 'application/pdf') return 'pdf'
  if (
    file.type ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx'
  }
  if (file.type.startsWith('text/')) return 'text'
  return null
}

export async function importResumeFile(file: File): Promise<ResumeData> {
  const format = getImportFormat(file)
  if (!format) {
    throw new Error(
      'Unsupported file type. Please upload a .json, .pdf, .docx, or .txt resume file.',
    )
  }

  if (format === 'json') {
    const text = await file.text()
    return migrateResumeData(JSON.parse(text))
  }

  const text =
    format === 'pdf'
      ? await extractTextFromPdf(file)
      : format === 'docx'
        ? await extractDocxText(file)
        : await file.text()

  if (!text.trim()) {
    throw new Error('Could not extract any text from the file.')
  }

  return importTextContent(text)
}
