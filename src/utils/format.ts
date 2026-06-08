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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

export function toMailtoUrl(email: string): string | null {
  const trimmed = email.trim()
  if (!isEmail(trimmed)) return null
  return `mailto:${trimmed}`
}

export function toTelUrl(phone: string): string | null {
  const trimmed = phone.trim()
  if (!trimmed) return null
  const digits = trimmed.replace(/[^\d+]/g, '')
  if (digits.length < 7) return null
  return `tel:${digits}`
}

export function toExternalUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed
  if (isEmail(trimmed)) return `mailto:${trimmed}`

  const withoutProtocol = trimmed.replace(/^\/\//, '')
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(withoutProtocol)) {
    return `https://${withoutProtocol}`
  }
  return null
}

export function getContactHref(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (isEmail(trimmed)) return `mailto:${trimmed}`
  const external = toExternalUrl(trimmed)
  if (external) return external
  return toTelUrl(trimmed)
}

export function opensInNewTab(href: string): boolean {
  return /^https?:\/\//i.test(href)
}
