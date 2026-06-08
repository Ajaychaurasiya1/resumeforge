import type { PersonalInfo } from '../types/resume'
import { getContactHref, toExternalUrl } from './format'

export interface ContactDisplayItem {
  text: string
  href: string | null
}

function textContact(value: string): ContactDisplayItem | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  return { text: trimmed, href: getContactHref(trimmed) }
}

function urlContact(url: string, label: string, defaultLabel: string): ContactDisplayItem | null {
  const trimmed = url.trim()
  if (!trimmed) return null
  return {
    text: label.trim() || defaultLabel,
    href: toExternalUrl(trimmed),
  }
}

/** Legacy imports may still have `website` instead of `portfolio`. */
type PersonalInfoRaw = Partial<PersonalInfo> & { website?: string }

export function migratePersonalInfo(
  raw: PersonalInfoRaw | undefined,
  defaults: PersonalInfo,
): PersonalInfo {
  const merged: PersonalInfo = {
    ...defaults,
    ...raw,
    customUrls: raw?.customUrls?.length ? raw.customUrls : defaults.customUrls,
  }
  if (raw?.website && !merged.portfolio) {
    merged.portfolio = raw.website
  }
  if (!merged.candidateType) merged.candidateType = 'Fresher'
  return merged
}

export function getPersonalContactItems(info: PersonalInfo): ContactDisplayItem[] {
  const legacy = info as PersonalInfo & { website?: string }
  const portfolio = info.portfolio || legacy.website || ''

  const items: ContactDisplayItem[] = []
  for (const item of [
    textContact(info.phone),
    textContact(info.email),
    textContact(info.location),
    urlContact(info.linkedin, info.linkedinLabel, 'LinkedIn'),
    urlContact(portfolio, info.portfolioLabel, 'Portfolio'),
    urlContact(info.github, info.githubLabel, 'GitHub'),
  ]) {
    if (item) items.push(item)
  }
  for (const custom of info.customUrls ?? []) {
    const item = urlContact(custom.url, custom.label, custom.url)
    if (item) items.push(item)
  }
  return items
}

export function getPersonalContactLine(info: PersonalInfo): string {
  return getPersonalContactItems(info)
    .map((item) => item.text)
    .join(' · ')
}

export function getPersonalSubtitle(info: PersonalInfo): string {
  return [info.role.trim(), info.candidateType.trim()].filter(Boolean).join(' · ')
}
