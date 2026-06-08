import mammoth from 'mammoth'

/** Normalize DOCX text: collapse table cells into readable lines. */
function normalizeDocxText(raw: string): string {
  return raw
    .replace(/\t+/g, ' | ')
    .replace(/[ \u00a0]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line, index, arr) => line || (index > 0 && arr[index - 1]))
    .join('\n')
    .trim()
}

export async function extractDocxText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const text = normalizeDocxText(result.value)

  if (!text.trim()) {
    throw new Error(
      'Could not read this DOCX file. If it is scanned or image-based, paste the text manually.',
    )
  }

  return text
}
