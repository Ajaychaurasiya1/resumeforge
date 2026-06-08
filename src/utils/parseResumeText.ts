import {
  defaultResumeData,
  emptyAchievement,
  emptyCertification,
  emptyEducation,
  emptyExperience,
  emptyLanguage,
  emptyPersonalInfo,
  emptyProject,
  type ResumeData,
} from '../types/resume'
import {
  autoCategorizeSkills,
  hasSkillContent,
  parseCategorizedSkillsText,
} from './skills'

const EMAIL_RE = /[\w.+-]+@[\w.-]+\.\w{2,}/
const PHONE_RE =
  /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}(?:[-.\s]?\d{2,4})?/
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i
const URL_RE = /(?:https?:\/\/)?(?:www\.)?[\w.-]+\.(?:com|dev|io|org|net|co)[\w./-]*/i
const LOCATION_RE =
  /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*))/
const DATE_RANGE_RE =
  /(\w{3,9}\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—to]+\s*(\w{3,9}\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|present|current|now)/i
const YEAR_RANGE_RE = /(\d{4})\s*[-–—to]+\s*(\d{4}|present|current|now)/i
const BULLET_RE = /^[-•*●○▪►]\s+/
const CONTACT_RE = new RegExp(
  `${EMAIL_RE.source}|${PHONE_RE.source}|${LINKEDIN_RE.source}|${GITHUB_RE.source}|${URL_RE.source}|${LOCATION_RE.source}`,
  'i',
)

type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'certifications'
  | 'languages'
  | 'other'

/** Normalized header label → section */
const EXACT_HEADERS: Record<string, SectionKey> = {
  summary: 'summary',
  profile: 'summary',
  objective: 'summary',
  'about me': 'summary',
  'professional summary': 'summary',
  'career objective': 'summary',
  'career summary': 'summary',
  overview: 'summary',
  experience: 'experience',
  'work experience': 'experience',
  'professional experience': 'experience',
  employment: 'experience',
  'work history': 'experience',
  'employment history': 'experience',
  'professional background': 'experience',
  career: 'experience',
  internships: 'experience',
  'internship experience': 'experience',
  education: 'education',
  academic: 'education',
  'academic background': 'education',
  qualifications: 'education',
  'educational background': 'education',
  skills: 'skills',
  'technical skills': 'skills',
  'core competencies': 'skills',
  competencies: 'skills',
  expertise: 'skills',
  technologies: 'skills',
  'tools & technologies': 'skills',
  'tools and technologies': 'skills',
  projects: 'projects',
  'personal projects': 'projects',
  'key projects': 'projects',
  portfolio: 'projects',
  'selected projects': 'projects',
  achievements: 'achievements',
  awards: 'achievements',
  honors: 'achievements',
  honours: 'achievements',
  accomplishments: 'achievements',
  'awards & honors': 'achievements',
  'awards and honors': 'achievements',
  certifications: 'certifications',
  certification: 'certifications',
  certificates: 'certifications',
  certificate: 'certifications',
  licenses: 'certifications',
  credentials: 'certifications',
  'professional certifications': 'certifications',
  languages: 'languages',
  language: 'languages',
  'language skills': 'languages',
  volunteer: 'experience',
  'volunteer experience': 'experience',
  'volunteer work': 'experience',
  trainings: 'achievements',
  training: 'achievements',
  courses: 'achievements',
  publications: 'projects',
  'research publications': 'projects',
  references: 'other',
  hobbies: 'other',
  interests: 'other',
}

function cleanHeaderCandidate(line: string): string {
  return line
    .replace(BULLET_RE, '')
    .replace(/^[\d]+[.)]\s*/, '')
    .replace(/^[#*_\s]+/, '')
    .replace(/[#*_\s]+$/, '')
    .replace(/[═─—_-]{2,}/g, ' ')
    .replace(/[:\s]+$/, '')
    .trim()
}

function isContactLine(line: string): boolean {
  return (
    CONTACT_RE.test(line) ||
    /[|•·]/.test(line) && (EMAIL_RE.test(line) || PHONE_RE.test(line))
  )
}

function looksLikeJobLine(line: string): boolean {
  if (BULLET_RE.test(line)) return false
  if (DATE_RANGE_RE.test(line) || YEAR_RANGE_RE.test(line)) return true
  if (/\|\s*.+\s*\|/.test(line) && line.length > 20) return true
  if (/\b(at|@)\b/i.test(line) && line.length < 100) return true
  return false
}

function detectSectionHeader(line: string): SectionKey | null {
  const clean = cleanHeaderCandidate(line)
  if (!clean || clean.length > 55) return null
  if (BULLET_RE.test(line)) return null
  if (DATE_RANGE_RE.test(clean) || YEAR_RANGE_RE.test(clean)) return null
  if (looksLikeJobLine(clean)) return null
  if (EMAIL_RE.test(clean) || PHONE_RE.test(clean)) return null

  const lower = clean.toLowerCase()
  if (EXACT_HEADERS[lower]) return EXACT_HEADERS[lower]

  const hadColon = /:\s*$/.test(line.trim())
  const isAllCaps =
    clean.length >= 3 &&
    clean === clean.toUpperCase() &&
    /[A-Z]/.test(clean) &&
    !/\d{4}/.test(clean)

  if (!hadColon && !isAllCaps) return null

  for (const [label, key] of Object.entries(EXACT_HEADERS)) {
    if (lower === label || lower.startsWith(label + ' ')) return key
  }

  return null
}

function stripInlineHeader(line: string): { header: SectionKey | null; content: string } {
  const clean = cleanHeaderCandidate(line)
  const lower = clean.toLowerCase()

  for (const [label, key] of Object.entries(EXACT_HEADERS)) {
    const prefix = label + ':'
    const prefixSpace = label + ' -'
    if (lower === label) return { header: key, content: '' }
    if (lower.startsWith(prefix)) {
      return { header: key, content: clean.slice(label.length + 1).trim() }
    }
    if (lower.startsWith(prefixSpace)) {
      return { header: key, content: clean.slice(label.length + 2).trim() }
    }
  }

  const header = detectSectionHeader(line)
  if (header) {
    const content = clean
      .replace(new RegExp(`^${Object.keys(EXACT_HEADERS).find((k) => EXACT_HEADERS[k] === header) ?? ''}`, 'i'), '')
      .replace(/^[\s:–—-]+/, '')
      .trim()
    return { header, content }
  }

  return { header: null, content: line }
}

interface SectionBlock {
  key: SectionKey
  lines: string[]
}

function splitIntoSections(lines: string[]): { headerLines: string[]; blocks: SectionBlock[] } {
  const headerLines: string[] = []
  const blocks: SectionBlock[] = []
  let current: SectionBlock | null = null
  let foundSection = false

  for (const line of lines) {
    const { header, content } = stripInlineHeader(line)

    if (header) {
      foundSection = true
      current = { key: header, lines: [] }
      blocks.push(current)
      if (content) current.lines.push(content)
      continue
    }

    const standalone = detectSectionHeader(line)
    if (standalone) {
      foundSection = true
      current = { key: standalone, lines: [] }
      blocks.push(current)
      continue
    }

    if (!foundSection) {
      headerLines.push(line)
    } else if (current) {
      current.lines.push(line)
    } else {
      blocks.push({ key: 'other', lines: [line] })
      current = blocks[blocks.length - 1]
    }
  }

  return { headerLines, blocks }
}

function mergeBlocks(blocks: SectionBlock[]): Record<SectionKey, string[]> {
  const merged: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    certifications: [],
    languages: [],
    other: [],
  }

  for (const block of blocks) {
    merged[block.key].push(...block.lines)
  }
  return merged
}

function parseDateToken(token: string): string {
  const t = token.trim().toLowerCase()
  if (t === 'present' || t === 'current' || t === 'now') return ''
  const monthYear = token.match(/(\w{3,9})\s+(\d{4})/i)
  if (monthYear) {
    const months: Record<string, string> = {
      jan: '01', january: '01', feb: '02', february: '02', mar: '03', march: '03',
      apr: '04', april: '04', may: '05', jun: '06', june: '06', jul: '07', july: '07',
      aug: '08', august: '08', sep: '09', sept: '09', september: '09',
      oct: '10', october: '10', nov: '11', november: '11', dec: '12', december: '12',
    }
    const m = months[monthYear[1].toLowerCase()]
    if (m) return `${monthYear[2]}-${m}`
  }
  const slash = token.match(/(\d{1,2})\/(\d{4})/)
  if (slash) return `${slash[2]}-${slash[1].padStart(2, '0')}`
  const year = token.match(/(\d{4})/)
  if (year) return year[1]
  return token.trim()
}

function extractDateRange(text: string): {
  startDate: string
  endDate: string
  current: boolean
  remainder: string
} {
  const match = text.match(DATE_RANGE_RE) ?? text.match(YEAR_RANGE_RE)
  if (!match) return { startDate: '', endDate: '', current: false, remainder: text }

  const endRaw = match[2].toLowerCase()
  const current = endRaw === 'present' || endRaw === 'current' || endRaw === 'now'
  const remainder = text.replace(match[0], '').replace(/[,\s|]+$/, '').trim()

  return {
    startDate: parseDateToken(match[1]),
    endDate: current ? '' : parseDateToken(match[2]),
    current,
    remainder,
  }
}

function parseHeaderBlock(headerLines: string[]) {
  const email = headerLines.join(' ').match(EMAIL_RE)?.[0] ?? ''
  const phone = headerLines.join(' ').match(PHONE_RE)?.[0] ?? ''
  const linkedin = headerLines.join(' ').match(LINKEDIN_RE)?.[0] ?? ''
  const github = headerLines.join(' ').match(GITHUB_RE)?.[0] ?? ''
  const websiteMatches = [...headerLines.join(' ').matchAll(new RegExp(URL_RE, 'gi'))].map((m) => m[0])
  const portfolio =
    websiteMatches.find(
      (u) =>
        !u.toLowerCase().includes('linkedin') &&
        !u.toLowerCase().includes('github'),
    ) ?? ''

  let location = ''
  for (const line of headerLines) {
    const loc = line.match(LOCATION_RE)
    if (loc) {
      location = loc[1]
      break
    }
  }

  let name = ''
  const summaryParts: string[] = []

  for (const line of headerLines) {
    if (detectSectionHeader(line)) continue

    if (!name && !isContactLine(line) && line.length >= 2 && line.length < 60 && !/^\d/.test(line)) {
      name = line
      continue
    }

    if (isContactLine(line)) continue

    if (line.length >= 20 && !looksLikeJobLine(line)) {
      summaryParts.push(line)
    }
  }

  return {
    personalInfo: {
      ...emptyPersonalInfo(),
      fullName: name,
      email,
      phone,
      location,
      linkedin,
      portfolio,
      github,
    },
    summary: summaryParts.join(' ').trim(),
  }
}

function parseSkillsBlock(text: string): string[] {
  const cleaned = text.replace(/^(skills|technical skills)[:\s]*/i, '')
  const skills = cleaned
    .split(/[,·|•\n;]/)
    .flatMap((chunk) => chunk.split(/\s{2,}/))
    .map((s) => s.replace(BULLET_RE, '').trim())
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 80 &&
        !detectSectionHeader(s) &&
        !DATE_RANGE_RE.test(s) &&
        !looksLikeJobLine(s),
    )

  return [...new Set(skills)]
}

function isExperienceEntryLine(line: string): boolean {
  if (BULLET_RE.test(line)) return false
  if (DATE_RANGE_RE.test(line) || YEAR_RANGE_RE.test(line)) return true
  if (/\s[-–—|]\s/.test(line) && line.length < 120) return true
  if (/\b(inc|llc|ltd|corp|technologies|solutions|group|company)\b/i.test(line) && line.length < 100)
    return true
  return false
}

function applyMetaLine(
  entry: ReturnType<typeof emptyExperience>,
  line: string,
): boolean {
  const { startDate, endDate, current: isCurrent, remainder } = extractDateRange(line)
  if (!startDate && !isCurrent) return false

  entry.startDate = startDate
  entry.endDate = endDate
  entry.current = isCurrent

  const pipeParts = line.split(/\s*\|\s*/)
  for (const part of pipeParts) {
    if (DATE_RANGE_RE.test(part) || YEAR_RANGE_RE.test(part)) continue
    const cleaned = part.replace(remainder, '').trim() || remainder
    if (cleaned && LOCATION_RE.test(cleaned)) {
      entry.location = cleaned.match(LOCATION_RE)?.[1] ?? cleaned
    } else if (cleaned && !entry.location && cleaned.length < 50) {
      entry.location = cleaned
    }
  }
  if (!entry.location && remainder && !DATE_RANGE_RE.test(remainder)) {
    entry.location = remainder.replace(/\|/g, '').trim()
  }
  return true
}

function fillExperienceEntry(entry: ReturnType<typeof emptyExperience>, line: string) {
  const { remainder } = extractDateRange(line)
  const body = remainder || line

  const pipeParts = body.split(/\s*\|\s*/)
  const atMatch = body.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i)
  const dashMatch = body.match(/^(.+?)\s+[-–—]\s+(.+)$/)
  const parenLoc = body.match(/^(.+?)\s*\(([^)]+)\)\s*$/)

  let text = body
  if (parenLoc) {
    text = parenLoc[1]
    entry.location = parenLoc[2]
  }

  if (pipeParts.length >= 2) {
    entry.position = pipeParts[0].trim()
    entry.company = pipeParts[1].trim()
    if (pipeParts[2] && !DATE_RANGE_RE.test(pipeParts[2])) {
      entry.location = pipeParts[2].trim()
    }
  } else if (atMatch) {
    entry.position = atMatch[1].trim()
    entry.company = atMatch[2].trim()
  } else if (dashMatch) {
    const left = dashMatch[1].trim()
    const right = dashMatch[2].trim()
    if (/inc|llc|ltd|corp|company|technologies|solutions|group/i.test(right)) {
      entry.position = left
      entry.company = right
    } else if (/inc|llc|ltd|corp|company|technologies|solutions|group/i.test(left)) {
      entry.company = left
      entry.position = right
    } else {
      entry.position = left
      entry.company = right
    }
  } else {
    entry.position = text.trim()
  }
}

function parseExperienceBlock(lines: string[]): ResumeData['experience'] {
  const entries: ResumeData['experience'] = []
  let current: ReturnType<typeof emptyExperience> | null = null
  const bullets: string[] = []

  const flush = () => {
    if (current && (current.company || current.position || bullets.length)) {
      current.description = bullets.join('\n')
      entries.push(current)
    }
    bullets.length = 0
    current = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    if (BULLET_RE.test(line)) {
      bullets.push(line.replace(BULLET_RE, ''))
      continue
    }

    const hasDates = DATE_RANGE_RE.test(line) || YEAR_RANGE_RE.test(line)

    if (
      current &&
      (current.position || current.company) &&
      !current.startDate &&
      !current.endDate &&
      hasDates
    ) {
      applyMetaLine(current, line)
      continue
    }

    if (hasDates && (!current || current.startDate || current.endDate)) {
      const onlyMeta =
        line.replace(DATE_RANGE_RE, '').replace(YEAR_RANGE_RE, '').replace(/\|/g, '').trim().length < 50
      if (onlyMeta && current && !current.startDate) {
        applyMetaLine(current, line)
        continue
      }
    }

    if (!isExperienceEntryLine(line) && !hasDates) {
      if (current) bullets.push(line)
      continue
    }

    flush()
    current = emptyExperience()
    if (hasDates) applyMetaLine(current, line)
    fillExperienceEntry(current, line)
  }
  flush()
  return entries.length ? entries : [emptyExperience()]
}

function isEducationLine(line: string): boolean {
  if (BULLET_RE.test(line)) return false
  return (
    /university|college|institute|school|academy|polytechnic/i.test(line) ||
    /bachelor|master|ph\.?\s*d|doctorate|associate|b\.?\s*s|m\.?\s*s|b\.?\s*a|m\.?\s*a|mba|b\.?\s*tech|m\.?\s*tech|b\.?\s*e|m\.?\s*e/i.test(
      line,
    ) ||
    /GPA/i.test(line) ||
    DATE_RANGE_RE.test(line) ||
    YEAR_RANGE_RE.test(line)
  )
}

function parseEducationBlock(lines: string[]): ResumeData['education'] {
  const entries: ResumeData['education'] = []
  let current: ReturnType<typeof emptyEducation> | null = null

  const flush = () => {
    if (current && (current.institution || current.degree || current.field)) {
      entries.push(current)
    }
    current = null
  }

  const degreeRe =
    /(bachelor(?:'s)?(?:\s+of\s+(?:science|arts|engineering|technology)\b)?|master(?:'s)?(?:\s+of\s+\w+)?|ph\.?\s*d\.?|doctorate|associate(?:'s)?|b\.?\s*s\.?c?\.?|m\.?\s*s\.?c?\.?|b\.?\s*a\.?|m\.?\s*a\.?|b\.?\s*tech|m\.?\s*tech|mba|b\.?\s*e\.?|m\.?\s*e\.?)/i

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const gpaOnly = line.match(/^GPA[:\s]*([\d.]+)/i)
    if (gpaOnly) {
      if (!current) current = emptyEducation()
      current.gpa = gpaOnly[1]
      continue
    }

    const gpa = line.match(/GPA[:\s]*([\d.]+)/i)
    const { startDate, endDate, remainder } = extractDateRange(line)
    const degreeMatch = remainder.match(degreeRe)
    const hasUniversity = /university|college|institute|school|academy|polytechnic/i.test(remainder)

    if (degreeMatch && !hasUniversity) {
      if (!current) current = emptyEducation()
      current.degree = degreeMatch[0].trim()
      const afterDegree = remainder
        .replace(degreeMatch[0], '')
        .replace(/^[\s,|–—-]+/, '')
        .replace(/GPA.*/i, '')
        .trim()
      if (afterDegree) current.field = afterDegree
      if (gpa) current.gpa = gpa[1]
      continue
    }

    if (hasUniversity || startDate || (degreeMatch && hasUniversity)) {
      if (current && current.degree && !current.institution) {
        if (gpa) current.gpa = gpa[1]
        if (startDate) current.startDate = startDate
        if (endDate) current.endDate = endDate
        current.institution = remainder.replace(/\|/g, ',').trim()
        if (degreeMatch && !current.degree) current.degree = degreeMatch[0].trim()
        continue
      }

      flush()
      current = emptyEducation()
      if (gpa) current.gpa = gpa[1]
      if (startDate) current.startDate = startDate
      if (endDate) current.endDate = endDate
      if (degreeMatch) current.degree = degreeMatch[0].trim()

      const withoutDegree = degreeMatch
        ? remainder.replace(degreeMatch[0], '').replace(/^[\s,|–—-]+/, '')
        : remainder

      current.institution = withoutDegree.replace(/\|/g, ',').replace(/GPA.*/i, '').trim() || line
      continue
    }

    if (current && !current.field && line.length < 80) {
      current.field = line
    }
  }
  flush()
  return entries.length ? entries : [emptyEducation()]
}

function parseProjectsBlock(lines: string[]): ResumeData['projects'] {
  const entries: ResumeData['projects'] = []
  let current: ReturnType<typeof emptyProject> | null = null
  const desc: string[] = []

  const flush = () => {
    if (current && (current.name || desc.length)) {
      current.description = desc.join('\n')
      entries.push(current)
    }
    desc.length = 0
    current = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const bullet = line.match(BULLET_RE)
    if (bullet) {
      desc.push(line.replace(BULLET_RE, ''))
      continue
    }

    const url = line.match(URL_RE)?.[0] ?? line.match(GITHUB_RE)?.[0] ?? ''
    const techMatch = line.match(/(?:technologies|tech stack|built with|stack)[:\s]+(.+)/i)
    const urlOnly = !!url && line.replace(URL_RE, '').replace(GITHUB_RE, '').trim().length < 3

    if (urlOnly && current) {
      current.url = url
      continue
    }

    const isTitle =
      !current ||
      (line.length < 90 && !techMatch && !BULLET_RE.test(line) && desc.length === 0 && !urlOnly)

    if (isTitle) {
      flush()
      current = emptyProject()
      const namePart = line.replace(URL_RE, '').replace(GITHUB_RE, '').trim()
      current.name = namePart.replace(/[-–—|]\s*$/, '').trim()
      if (url) current.url = url
      if (techMatch) current.technologies = techMatch[1].trim()
    } else if (current) {
      if (techMatch) current.technologies = techMatch[1].trim()
      else if (url && !current.url) current.url = url
      else desc.push(line)
    }
  }
  flush()
  return entries
}

function parseCertificationsBlock(lines: string[]): ResumeData['certifications'] {
  const entries: ResumeData['certifications'] = []

  for (const rawLine of lines) {
    const line = rawLine.replace(BULLET_RE, '').trim()
    if (!line || line.length < 3) continue

    const cert = emptyCertification()
    const { startDate, remainder } = extractDateRange(line)
    if (startDate) cert.date = startDate

    const dashSplit = remainder.split(/\s+[-–—]\s+/)
    if (dashSplit.length >= 2) {
      cert.name = dashSplit[0].trim()
      cert.issuer = dashSplit.slice(1).join(' - ').trim()
    } else {
      const commaSplit = remainder.split(/,\s*/)
      cert.name = commaSplit[0].trim()
      if (commaSplit.length > 1) cert.issuer = commaSplit.slice(1).join(', ').trim()
    }

    const url = line.match(URL_RE)?.[0]
    if (url) cert.url = url

    if (cert.name) entries.push(cert)
  }
  return entries
}

function parseAchievementsBlock(lines: string[]): ResumeData['achievements'] {
  const entries: ResumeData['achievements'] = []

  for (const rawLine of lines) {
    const line = rawLine.replace(BULLET_RE, '').trim()
    if (!line || line.length < 3) continue

    const ach = emptyAchievement()
    const { startDate, remainder } = extractDateRange(line)
    if (startDate) ach.date = startDate

    const dashSplit = remainder.split(/\s+[-–—]\s+/)
    if (dashSplit.length >= 2) {
      ach.title = dashSplit[0].trim()
      ach.organization = dashSplit[1].trim()
      if (dashSplit.length > 2) ach.description = dashSplit.slice(2).join(' - ')
    } else {
      ach.title = remainder
    }

    if (ach.title) entries.push(ach)
  }
  return entries
}

function parseLanguagesBlock(text: string): ResumeData['languages'] {
  const proficiencies = ['native', 'fluent', 'advanced', 'intermediate', 'basic', 'professional', 'conversational']
  const entries: ResumeData['languages'] = []

  const chunks = text
    .split(/[,·|•\n;]/)
    .map((s) => s.replace(BULLET_RE, '').trim())
    .filter(Boolean)

  for (const chunk of chunks) {
    const paren = chunk.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
    const dash = chunk.match(/^(.+?)\s*[-–—:]\s*(.+)$/)
    const lang = emptyLanguage()

    if (paren) {
      lang.name = paren[1].trim()
      const prof = paren[2].trim()
      if (proficiencies.some((p) => prof.toLowerCase().includes(p))) {
        lang.proficiency = normalizeProficiency(prof)
      }
    } else if (dash) {
      lang.name = dash[1].trim()
      lang.proficiency = normalizeProficiency(dash[2])
    } else if (chunk.length < 40) {
      lang.name = chunk
    }

    if (lang.name && lang.name.length > 1 && !detectSectionHeader(lang.name)) {
      entries.push(lang)
    }
  }
  return entries
}

function normalizeProficiency(raw: string): ResumeData['languages'][0]['proficiency'] {
  const lower = raw.toLowerCase()
  if (lower.includes('native')) return 'Native'
  if (lower.includes('fluent') || lower.includes('professional')) return 'Fluent'
  if (lower.includes('advanced')) return 'Advanced'
  if (lower.includes('intermediate') || lower.includes('conversational')) return 'Intermediate'
  if (lower.includes('basic') || lower.includes('beginner')) return 'Basic'
  return ''
}

/** Re-classify lines that landed in the wrong section or in "other" */
function redistributeOrphans(sections: Record<SectionKey, string[]>): Record<SectionKey, string[]> {
  const orphanLines = [...sections.other]
  sections.other = []

  const skillsLike = (line: string) => {
    const parts = line.split(/[,;|•]/)
    return parts.length >= 3 && parts.every((p) => p.trim().length < 35)
  }

  for (const line of orphanLines) {
    if (!line.trim()) continue

    if (detectSectionHeader(line)) continue

    if (isEducationLine(line)) {
      sections.education.push(line)
    } else if (isExperienceEntryLine(line)) {
      sections.experience.push(line)
    } else if (skillsLike(line)) {
      sections.skills.push(line)
    } else if (BULLET_RE.test(line)) {
      if (sections.experience.length) sections.experience.push(line)
      else if (sections.projects.length) sections.projects.push(line)
      else sections.experience.push(line)
    } else if (line.length >= 30 && !looksLikeJobLine(line)) {
      sections.summary.push(line)
    } else if (sections.experience.length) {
      sections.experience.push(line)
    } else {
      sections.summary.push(line)
    }
  }

  return sections
}

/** If skills ended up inside experience (common PDF issue), peel them off */
function splitSkillsFromExperience(
  experienceLines: string[],
  skillsLines: string[],
): { experience: string[]; skills: string[] } {
  const exp: string[] = []
  const skills: string[] = [...skillsLines]
  let inSkillRun = false
  let skillRun: string[] = []

  const flushSkillRun = () => {
    if (skillRun.length >= 2) skills.push(...skillRun)
    else exp.push(...skillRun)
    skillRun = []
    inSkillRun = false
  }

  for (const line of experienceLines) {
    const isSkillLine =
      !BULLET_RE.test(line) &&
      !DATE_RANGE_RE.test(line) &&
      !looksLikeJobLine(line) &&
      (line.split(/[,;|]/).length >= 4 ||
        /^(java|python|javascript|react|node|sql|aws|html|css|typescript)/i.test(line))

    if (isSkillLine) {
      inSkillRun = true
      skillRun.push(line)
    } else {
      if (inSkillRun) flushSkillRun()
      exp.push(line)
    }
  }
  if (inSkillRun) flushSkillRun()

  return { experience: exp, skills }
}

export function parseResumeFromText(rawText: string): ResumeData {
  const base = defaultResumeData()
  const text = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' | ')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (!text) return base

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const { headerLines, blocks } = splitIntoSections(lines)
  let sections = mergeBlocks(blocks)
  sections = redistributeOrphans(sections)

  const header = parseHeaderBlock(headerLines)
  const split = splitSkillsFromExperience(sections.experience, sections.skills)
  sections.experience = split.experience
  sections.skills = [...sections.skills, ...split.skills]

  const summary = [header.summary, sections.summary.join(' ')].filter(Boolean).join(' ').slice(0, 1500)
  const skillsText = sections.skills.join('\n')
  const categorized = parseCategorizedSkillsText(skillsText)
  const flatSkills = parseSkillsBlock(skillsText)
  const skillCategories = categorized ?? (flatSkills.length ? autoCategorizeSkills(flatSkills) : base.skillCategories)

  return {
    ...base,
    personalInfo: { ...base.personalInfo, ...header.personalInfo },
    summary,
    skillCategories,
    experience: parseExperienceBlock(sections.experience),
    education: parseEducationBlock(sections.education),
    projects: parseProjectsBlock(sections.projects),
    achievements: parseAchievementsBlock(sections.achievements),
    certifications: parseCertificationsBlock(sections.certifications),
    languages: parseLanguagesBlock(sections.languages.join('\n')),
  }
}

export function hasResumeContent(data: ResumeData): boolean {
  const { personalInfo } = data
  return !!(
    personalInfo.fullName ||
    personalInfo.email ||
    data.summary.trim() ||
    data.experience.some((e) => e.company || e.position) ||
    data.education.some((e) => e.institution || e.degree) ||
    hasSkillContent(data.skillCategories) ||
    data.projects.some((p) => p.name) ||
    data.achievements.some((a) => a.title) ||
    data.certifications.some((c) => c.name) ||
    data.languages.some((l) => l.name)
  )
}
