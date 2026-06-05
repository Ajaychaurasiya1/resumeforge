import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface TextItem {
  str: string
  x: number
  y: number
  width: number
}

function clusterByY(items: TextItem[], tolerance: number): TextItem[][] {
  if (!items.length) return []

  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x)
  const rows: { y: number; parts: TextItem[] }[] = []

  for (const item of sorted) {
    const row = rows.find((r) => Math.abs(r.y - item.y) <= tolerance)
    if (row) row.parts.push(item)
    else rows.push({ y: item.y, parts: [item] })
  }

  return rows
    .sort((a, b) => b.y - a.y)
    .map((row) => row.parts.sort((a, b) => a.x - b.x))
}

function rowToLines(parts: TextItem[], gapThreshold = 14): string[] {
  if (!parts.length) return []

  const lines: string[] = []
  let group: TextItem[] = [parts[0]]

  for (let i = 1; i < parts.length; i++) {
    const prev = parts[i - 1]
    const curr = parts[i]
    const gap = curr.x - (prev.x + prev.width)
    if (gap > gapThreshold) {
      lines.push(group.map((p) => p.str).join(' ').replace(/\s{2,}/g, ' ').trim())
      group = [curr]
    } else {
      group.push(curr)
    }
  }

  lines.push(group.map((p) => p.str).join(' ').replace(/\s{2,}/g, ' ').trim())
  return lines.filter(Boolean)
}

function itemsToLines(items: TextItem[], pageWidth: number, yTolerance = 5): string[] {
  if (!items.length) return []

  const midpoint = pageWidth / 2
  const hasTwoColumns =
    items.some((i) => i.x < midpoint - 40) && items.some((i) => i.x > midpoint + 40)

  const process = (subset: TextItem[]) => {
    const rows = clusterByY(subset, yTolerance)
    return rows.flatMap((parts) => rowToLines(parts))
  }

  if (!hasTwoColumns) return process(items)

  const left = items.filter((i) => i.x + i.width / 2 < midpoint)
  const right = items.filter((i) => i.x + i.width / 2 >= midpoint)

  const leftLines = process(left)
  const rightLines = process(right)

  if (!leftLines.length) return rightLines
  if (!rightLines.length) return leftLines

  return [...leftLines, '', ...rightLines]
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    const items: TextItem[] = []

    for (const raw of content.items) {
      if (!('str' in raw) || !raw.str.trim()) continue
      const transform = raw.transform
      items.push({
        str: raw.str,
        x: transform[4],
        y: transform[5],
        width: raw.width ?? raw.str.length * 6,
      })
    }

    pages.push(itemsToLines(items, viewport.width).join('\n'))
  }

  return pages.join('\n\n')
}
