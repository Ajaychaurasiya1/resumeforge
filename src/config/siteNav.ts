export interface SiteNavLink {
  to: string
  label: string
}

export const PLATFORM_LINKS: SiteNavLink[] = [
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/templates', label: 'Templates' },
  { to: '/builder', label: 'Resume Builder' },
]

export const COMPANY_LINKS: SiteNavLink[] = [
  { to: '/about', label: 'About Us' },
  { to: '/mission', label: 'Our Mission' },
  { to: '/privacy', label: 'Privacy' },
]

export const HEADER_LINKS: SiteNavLink[] = [
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/templates', label: 'Templates' },
  ...COMPANY_LINKS,
]

export const BUILDER_LINK: SiteNavLink = { to: '/builder', label: 'Resume Builder' }

export function isNavActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}
