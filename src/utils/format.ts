export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const monthIndex = parseInt(month, 10) - 1
  if (monthIndex >= 0 && monthIndex < 12) {
    return `${months[monthIndex]} ${year}`
  }
  return year
}

export function formatDateRange(
  start: string,
  end: string,
  current: boolean,
): string {
  const startFormatted = formatDate(start)
  const endFormatted = current ? 'Present' : formatDate(end)
  if (!startFormatted && !endFormatted) return ''
  if (!startFormatted) return endFormatted
  if (!endFormatted) return startFormatted
  return `${startFormatted} – ${endFormatted}`
}

export function splitLines(text: string): string[] {
  return text.split('\n').filter((line) => line.trim())
}
