import { emptyExperience, type Experience, type ResumeData } from '../types/resume'
import { mergeSkillsIntoCategories } from './skills'
import { parseResumeFromText } from './parseResumeText'

const EXPERIENCE_HEADER = /^(?:experience|work experience|employment|positions?)$/i
const EDUCATION_HEADER = /^(?:education|school)$/i
const SKILLS_HEADER = /^skills?$/i

function parseDuration(line: string): { start: string; end: string; current: boolean } {
  const range = line.match(/(\d{4})\s*[-–—to]+\s*(\d{4}|present|current|now)/i)
  if (!range) return { start: '', end: '', current: false }
  return {
    start: `${range[1]}-01`,
    end: range[2].match(/present|current|now/i) ? '' : `${range[2]}-01`,
    current: /present|current|now/i.test(range[2]),
  }
}

function parseLinkedInExperience(block: string): Experience[] {
  const items: Experience[] = []
  const chunks = block.split(/\n(?=[A-Z][^\n]{2,})/)

  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) continue

    const titleLine = lines[0]
    const companyLine = lines[1]
    const dateLine = lines.find((l) => /\d{4}/.test(l)) ?? ''
    const { start, end, current } = parseDuration(dateLine)

    const description = lines
      .slice(2)
      .filter((l) => !/\d{4}/.test(l) || l.length > 30)
      .join('\n')

    if (titleLine && companyLine) {
      items.push({
        ...emptyExperience(),
        position: titleLine,
        company: companyLine.replace(/\s·\s.*$/, ''),
        startDate: start,
        endDate: end,
        current,
        description,
      })
    }
  }

  return items
}

/** Parse pasted LinkedIn profile export / copy text into resume fields. */
export function parseLinkedInText(text: string): Partial<ResumeData> {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return {}

  const base = parseResumeFromText(normalized)
  const sections: Record<string, string> = {}
  let current = 'header'
  const buffers: string[] = []

  const flush = () => {
    sections[current] = buffers.join('\n').trim()
    buffers.length = 0
  }

  for (const line of normalized.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (EXPERIENCE_HEADER.test(trimmed)) {
      flush()
      current = 'experience'
      continue
    }
    if (EDUCATION_HEADER.test(trimmed)) {
      flush()
      current = 'education'
      continue
    }
    if (SKILLS_HEADER.test(trimmed)) {
      flush()
      current = 'skills'
      continue
    }
    buffers.push(trimmed)
  }
  flush()

  const linkedInExp = sections.experience ? parseLinkedInExperience(sections.experience) : []
  const experience =
    linkedInExp.length > 0
      ? linkedInExp
      : base.experience.filter((e) => e.company || e.position)

  const skillLines = sections.skills?.split(/[,•|·\n]/).map((s) => s.trim()).filter(Boolean) ?? []
  const skillCategories = mergeSkillsIntoCategories(
    base.skillCategories,
    skillLines,
  )

  const firstLine = normalized.split('\n').find((l) => l.trim())?.trim() ?? ''

  return {
    personalInfo: {
      ...base.personalInfo,
      fullName: base.personalInfo.fullName || firstLine,
      linkedin: base.personalInfo.linkedin || 'linkedin.com/in/profile',
    },
    summary: base.summary || sections.header?.split('\n').slice(1, 4).join(' ').slice(0, 400),
    experience: experience.length ? experience : base.experience,
    education: base.education,
    skillCategories,
  }
}

export function mergeLinkedInImport(current: ResumeData, patch: Partial<ResumeData>): ResumeData {
  return {
    ...current,
    personalInfo: { ...current.personalInfo, ...patch.personalInfo },
    summary: patch.summary || current.summary,
    experience: patch.experience?.length ? patch.experience : current.experience,
    education: patch.education?.length ? patch.education : current.education,
    skillCategories: patch.skillCategories?.some((c) => c.skills.trim())
      ? patch.skillCategories
      : current.skillCategories,
  }
}

export function isLikelyLinkedInPaste(text: string): boolean {
  return (
    /linkedin/i.test(text) ||
    (/experience/i.test(text) && /education/i.test(text) && text.split('\n').length > 15)
  )
}
