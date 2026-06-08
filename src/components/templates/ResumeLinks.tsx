import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import type { ContactDisplayItem } from '../../utils/personalInfo'
import { getContactHref, opensInNewTab, toExternalUrl, toMailtoUrl } from '../../utils/format'

const DEFAULT_LINK_CLASS =
  'underline decoration-slate-300/70 underline-offset-2 hover:decoration-current'

export function ResumeLink({
  href,
  children,
  className = DEFAULT_LINK_CLASS,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const external = opensInNewTab(href)
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export function ResumeTextLink({
  value,
  className = DEFAULT_LINK_CLASS,
}: {
  value: string
  className?: string
}) {
  const href = getContactHref(value)
  if (!href) return <>{value}</>
  return (
    <ResumeLink href={href} className={className}>
      {value}
    </ResumeLink>
  )
}

export function LabeledContactLine({
  items,
  separator = ' · ',
  className,
  linkClassName = DEFAULT_LINK_CLASS,
}: {
  items: ContactDisplayItem[]
  separator?: string
  className?: string
  linkClassName?: string
}) {
  if (items.length === 0) return null
  return (
    <p className={className}>
      {items.map((item, index) => (
        <span key={`${item.text}-${index}`}>
          {index > 0 && separator}
          {item.href ? (
            <ResumeLink href={item.href} className={linkClassName}>
              {item.text}
            </ResumeLink>
          ) : (
            item.text
          )}
        </span>
      ))}
    </p>
  )
}

export function ContactLine({
  items,
  separator = ' · ',
  className,
  linkClassName = DEFAULT_LINK_CLASS,
}: {
  items: string[]
  separator?: string
  className?: string
  linkClassName?: string
}) {
  if (items.length === 0) return null
  return (
    <p className={className}>
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>
          {index > 0 && separator}
          <ResumeTextLink value={item} className={linkClassName} />
        </span>
      ))}
    </p>
  )
}

export function ExternalUrlLink({
  url,
  className = 'text-xs text-slate-400 underline decoration-slate-300/70 underline-offset-2 hover:text-slate-600',
}: {
  url: string
  className?: string
}) {
  const href = toExternalUrl(url)
  if (!href) return <span className={className}>{url}</span>
  return (
    <ResumeLink href={href} className={className}>
      {url}
    </ResumeLink>
  )
}

export function FormLinkPreview({
  value,
  label = 'Open link',
}: {
  value: string
  label?: string
}) {
  const href = toExternalUrl(value) ?? toMailtoUrl(value)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
    >
      <ExternalLink size={12} />
      {label}
    </a>
  )
}
