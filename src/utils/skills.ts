import type { ResumeData, SkillCategory } from '../types/resume'

export const DEFAULT_SKILL_CATEGORY_NAMES = [
  'Languages',
  'Frontend Development',
  'Backend Development',
  'Database Management',
  'Tools & Software',
] as const

const CATEGORY_MATCHERS: { name: (typeof DEFAULT_SKILL_CATEGORY_NAMES)[number]; patterns: RegExp[] }[] = [
  {
    name: 'Languages',
    patterns: [
      /languages?/i,
      /programming/i,
      /^c\+\+$/i,
      /^c#$/i,
      /javascript|typescript|python|java|ruby|golang|kotlin|swift|scala|php|\bc\b/i,
    ],
  },
  {
    name: 'Frontend Development',
    patterns: [/frontend/i, /react|angular|vue|next\.?js|html|css|tailwind|bootstrap|sass|svelte|webpack/i],
  },
  {
    name: 'Backend Development',
    patterns: [/backend/i, /node\.?js|express|django|flask|spring|\.net|rest\s*api|graphql|fastapi|microservices/i],
  },
  {
    name: 'Database Management',
    patterns: [/database/i, /mysql|mongodb|postgresql|postgres|redis|sql|oracle|dynamo|sqlite|mariadb/i],
  },
  {
    name: 'Tools & Software',
    patterns: [
      /tools?/i,
      /software/i,
      /git|github|postman|vs\s*code|docker|digital\s*ocean|kubernetes|jenkins|jira|figma|npm|yarn/i,
    ],
  },
]

const SKILL_TO_CATEGORY: { pattern: RegExp; category: (typeof DEFAULT_SKILL_CATEGORY_NAMES)[number] }[] = [
  { pattern: /javascript|typescript|\bjs\b|es6|es2015/i, category: 'Languages' },
  { pattern: /^c\+\+$/i, category: 'Languages' },
  { pattern: /^c#$/i, category: 'Languages' },
  { pattern: /^c$/i, category: 'Languages' },
  { pattern: /python|java|ruby|go\b|golang|kotlin|swift|scala|php|r\b/i, category: 'Languages' },
  { pattern: /react|angular|vue|next\.?js|html|css|tailwind|bootstrap|sass|svelte|webpack|vite/i, category: 'Frontend Development' },
  { pattern: /node\.?js|express|django|flask|spring|\.net|rest\s*api|graphql|fastapi|nestjs/i, category: 'Backend Development' },
  { pattern: /mysql|mongodb|postgresql|postgres|redis|sql|oracle|dynamo|sqlite|mariadb|firebase/i, category: 'Database Management' },
  { pattern: /git|github|postman|vs\s*code|docker|digital\s*ocean|kubernetes|jenkins|jira|figma|npm|yarn|linux|aws|azure/i, category: 'Tools & Software' },
]

export function defaultSkillCategories(): SkillCategory[] {
  return DEFAULT_SKILL_CATEGORY_NAMES.map((name) => ({
    id: crypto.randomUUID(),
    name,
    skills: '',
  }))
}

export function parseSkillsString(text: string): string[] {
  return text
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function joinSkillsString(skills: string[]): string {
  return skills
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s, index, arr) => arr.findIndex((x) => x.toLowerCase() === s.toLowerCase()) === index)
    .join(', ')
}

export function getFlatSkills(categories: SkillCategory[]): string[] {
  const all: string[] = []
  for (const category of categories) {
    all.push(...parseSkillsString(category.skills))
  }
  return joinSkillsString(all)
    .split(', ')
    .filter(Boolean)
}

export function hasSkillContent(categories: SkillCategory[]): boolean {
  return categories.some((c) => c.skills.trim().length > 0)
}

export function countFlatSkills(categories: SkillCategory[]): number {
  return getFlatSkills(categories).length
}

function matchCategoryName(rawName: string): (typeof DEFAULT_SKILL_CATEGORY_NAMES)[number] | null {
  const normalized = rawName.toLowerCase().replace(/[^a-z]/g, '')
  for (const matcher of CATEGORY_MATCHERS) {
    const catNorm = matcher.name.toLowerCase().replace(/[^a-z]/g, '')
    if (normalized === catNorm || normalized.includes(catNorm.slice(0, 8)) || catNorm.includes(normalized)) {
      return matcher.name
    }
    if (matcher.patterns.some((p) => p.test(rawName))) return matcher.name
  }
  return null
}

function categoryForSkill(skill: string): (typeof DEFAULT_SKILL_CATEGORY_NAMES)[number] {
  for (const rule of SKILL_TO_CATEGORY) {
    if (rule.pattern.test(skill)) return rule.category
  }
  return 'Tools & Software'
}

export function autoCategorizeSkills(flatSkills: string[]): SkillCategory[] {
  const categories = defaultSkillCategories()
  for (const skill of flatSkills) {
    const trimmed = skill.trim()
    if (!trimmed) continue
    const targetName = categoryForSkill(trimmed)
    const target = categories.find((c) => c.name === targetName)
    if (!target) continue
    const existing = parseSkillsString(target.skills)
    if (!existing.some((e) => e.toLowerCase() === trimmed.toLowerCase())) {
      target.skills = joinSkillsString([...existing, trimmed])
    }
  }
  return categories
}

export function mergeSkillsIntoCategories(
  categories: SkillCategory[],
  incoming: string[],
): SkillCategory[] {
  const next = categories.map((c) => ({ ...c }))
  const categorized = autoCategorizeSkills(incoming)
  for (const source of categorized) {
    if (!source.skills.trim()) continue
    const target = next.find((c) => c.name === source.name)
    if (!target) continue
    const merged = [...parseSkillsString(target.skills), ...parseSkillsString(source.skills)]
    target.skills = joinSkillsString(merged)
  }
  return next
}

export function parseCategorizedSkillsText(text: string): SkillCategory[] | null {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const parsed: { name: string; skills: string }[] = []
  for (const line of lines) {
    const match = line.match(/^([^:]{2,40}):\s*(.+)$/)
    if (match) {
      parsed.push({ name: match[1].trim(), skills: match[2].trim() })
    }
  }

  if (parsed.length === 0) return null

  const categories = defaultSkillCategories()
  for (const item of parsed) {
    const mapped = matchCategoryName(item.name)
    const target = mapped ? categories.find((c) => c.name === mapped) : null
    if (target) {
      const merged = [...parseSkillsString(target.skills), ...parseSkillsString(item.skills)]
      target.skills = joinSkillsString(merged)
    }
  }
  return categories
}

export function ensureDefaultCategories(categories: SkillCategory[]): SkillCategory[] {
  const defaults = defaultSkillCategories()
  return defaults.map((def) => {
    const existing = categories.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, '') === def.name.toLowerCase().replace(/\s+/g, ''),
    )
    return existing ? { ...existing, name: def.name } : def
  })
}

export function migrateSkillCategories(
  data: Partial<ResumeData> & { skills?: string[] },
): SkillCategory[] {
  if (data.skillCategories?.length) {
    return ensureDefaultCategories(data.skillCategories)
  }
  if (data.skills?.length) {
    return autoCategorizeSkills(data.skills)
  }
  return defaultSkillCategories()
}

function improveSkillName(skill: string): string {
  const trimmed = skill.trim()
  const fixes: [RegExp, string][] = [
    [/^javascript(\s*\(es6\+\))?$/i, 'JavaScript (ES6+)'],
    [/^js$/i, 'JavaScript (ES6+)'],
    [/^react(\.js)?$/i, 'React.js'],
    [/^next(\.js)?$/i, 'Next.js'],
    [/^node(\.js)?$/i, 'Node.js'],
    [/^express(\.js)?$/i, 'Express.js'],
    [/^html$/i, 'HTML5'],
    [/^css$/i, 'CSS3'],
    [/^html5$/i, 'HTML5'],
    [/^css3$/i, 'CSS3'],
    [/^tailwind(\s*css)?$/i, 'Tailwind CSS'],
    [/^bootstrap$/i, 'Bootstrap'],
    [/^mysql$/i, 'MySQL'],
    [/^mongodb$/i, 'MongoDB'],
    [/^git$/i, 'Git'],
    [/^github$/i, 'GitHub'],
    [/^postman$/i, 'Postman'],
    [/^vs\s*code$/i, 'VS Code'],
    [/^vscode$/i, 'VS Code'],
    [/^docker$/i, 'Docker'],
    [/^digital\s*ocean$/i, 'Digital Ocean'],
    [/^rest\s*apis?$/i, 'REST APIs'],
  ]

  for (const [pattern, replacement] of fixes) {
    if (pattern.test(trimmed)) return replacement
  }
  return trimmed
}

export function improveSkillCategories(categories: SkillCategory[]): SkillCategory[] {
  return categories.map((category) => ({
    ...category,
    skills: joinSkillsString(parseSkillsString(category.skills).map(improveSkillName)),
  }))
}

export function formatSkillsForExport(categories: SkillCategory[]): string {
  return categories
    .filter((c) => c.skills.trim())
    .map((c) => `${c.name}: ${c.skills.trim()}`)
    .join('\n')
}

export function getSkillsContextForAi(resume: ResumeData): string {
  return formatSkillsForExport(resume.skillCategories) || getFlatSkills(resume.skillCategories).join(', ')
}

export function extractSkillsFromResumeText(resume: ResumeData): SkillCategory[] {
  const parts: string[] = []
  for (const exp of resume.experience) {
    parts.push(exp.description, exp.position, exp.company)
  }
  for (const proj of resume.projects) {
    parts.push(proj.technologies, proj.description, proj.name)
  }
  parts.push(resume.summary)
  const flat = getFlatSkills(resume.skillCategories)
  const fromText = parts.join(' ')
  const tokens = fromText.match(
    /\b(?:JavaScript|TypeScript|React(?:\.js)?|Next(?:\.js)?|Node(?:\.js)?|Express(?:\.js)?|HTML5?|CSS3?|Tailwind(?:\s*CSS)?|Bootstrap|MySQL|MongoDB|Git|GitHub|Postman|VS\s*Code|Docker|Python|Java|C\+\+|REST\s*APIs?)\b/gi,
  )
  const merged = [...flat, ...(tokens ?? [])]
  return autoCategorizeSkills(merged)
}
