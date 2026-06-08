const STORAGE_KEY = 'resume-forge-job-keywords'

export function saveJobKeywords(keywords: string[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keywords))
}

export function loadJobKeywords(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function clearJobKeywords(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function highlightKeywordsInText(text: string, keywords: string[]): string {
  if (!keywords.length || !text.trim()) return text
  let result = text
  const sorted = [...keywords].sort((a, b) => b.length - a.length)
  for (const kw of sorted) {
    if (kw.length < 2) continue
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(${escaped})`, 'gi')
    result = result.replace(re, '⟦$1⟧')
  }
  return result
}

export function renderHighlightedHtml(text: string): string {
  return text
    .replace(/⟦/g, '<mark class="bg-amber-200/80 text-slate-900 rounded px-0.5">')
    .replace(/⟧/g, '</mark>')
}
