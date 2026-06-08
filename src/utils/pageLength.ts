import type { ResumeData, ResumeSettings } from '../types/resume'
import { getFlatSkills } from './skills'

export type PageCount = 1 | 2 | '2+'
export type PageLengthStatus = 'good' | 'warning' | 'overflow'

export interface PageLengthEstimate {
  pages: PageCount
  status: PageLengthStatus
}

const CHARS_PER_PAGE: Record<ResumeSettings['fontSize'], number> = {
  sm: 3200,
  md: 2800,
  lg: 2400,
}

function collectText(data: ResumeData): string {
  const parts: string[] = [
    data.personalInfo.fullName,
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.summary,
    ...getFlatSkills(data.skillCategories),
    ...data.experience.flatMap((e) => [
      e.company,
      e.position,
      e.location,
      e.description,
    ]),
    ...data.education.flatMap((e) => [
      e.institution,
      e.degree,
      e.field,
      e.gpa,
    ]),
    ...data.projects.flatMap((p) => [p.name, p.description, p.technologies]),
    ...data.certifications.flatMap((c) => [c.name, c.issuer]),
    ...data.achievements.flatMap((a) => [a.title, a.description]),
    ...data.languages.map((l) => l.name),
    ...data.hobbies.map((h) => h.name),
    ...data.customSections.flatMap((s) => [
      s.title,
      ...s.items.flatMap((i) => [i.title, i.description]),
    ]),
  ]

  return parts.filter(Boolean).join(' ')
}

export function estimatePageCount(data: ResumeData): PageLengthEstimate {
  const text = collectText(data)
  const charCount = text.length
  const charsPerPage = CHARS_PER_PAGE[data.settings.fontSize]
  const ratio = charCount / charsPerPage

  let pages: PageCount
  if (ratio <= 1) pages = 1
  else if (ratio <= 2) pages = 2
  else pages = '2+'

  let status: PageLengthStatus
  if (pages === 1 || (pages === 2 && ratio <= 1.85)) {
    status = 'good'
  } else if (pages === 2 || (pages === '2+' && ratio <= 2.5)) {
    status = 'warning'
  } else {
    status = 'overflow'
  }

  return { pages, status }
}
