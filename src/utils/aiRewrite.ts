import type { ResumeData, SkillCategory } from '../types/resume'
import { improveBullet, improveSummary } from './smartRewrite'
import { formatSkillsForExport, getSkillsContextForAi, improveSkillCategories } from './skills'

const OPENAI_KEY_STORAGE = 'resume-forge-openai-key'
const OPENAI_MODEL_STORAGE = 'resume-forge-openai-model'

export function getOpenAiKey(): string {
  return localStorage.getItem(OPENAI_KEY_STORAGE) ?? ''
}

export function setOpenAiKey(key: string): void {
  if (key.trim()) localStorage.setItem(OPENAI_KEY_STORAGE, key.trim())
  else localStorage.removeItem(OPENAI_KEY_STORAGE)
}

export function getOpenAiModel(): string {
  return localStorage.getItem(OPENAI_MODEL_STORAGE) ?? 'gpt-4o-mini'
}

export function setOpenAiModel(model: string): void {
  localStorage.setItem(OPENAI_MODEL_STORAGE, model.trim() || 'gpt-4o-mini')
}

export function hasOpenAiKey(): boolean {
  return getOpenAiKey().length > 0
}

async function callOpenAi(system: string, user: string): Promise<string> {
  const key = getOpenAiKey()
  if (!key) throw new Error('Add your OpenAI API key in Download → AI Settings.')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'AI request failed')
  }

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  return json.choices?.[0]?.message?.content?.trim() ?? ''
}

export async function aiImproveSummary(resume: ResumeData): Promise<string> {
  if (!hasOpenAiKey()) return improveSummary(resume.summary)

  const result = await callOpenAi(
    'You rewrite resume summaries. Output ONLY the improved summary (2-4 sentences, 40-80 words). Use strong verbs and metrics when possible. No markdown.',
    `Rewrite this professional summary:\n\n${resume.summary}\n\nTarget role context skills: ${getSkillsContextForAi(resume)}`,
  )
  return result || improveSummary(resume.summary)
}

export async function aiImproveBullets(description: string): Promise<string> {
  if (!hasOpenAiKey()) {
    return description
      .split('\n')
      .map((line) => improveBullet(line))
      .join('\n')
  }

  const result = await callOpenAi(
    'You rewrite resume bullet points. Return ONLY bullet lines, one per line, no numbering or markdown. Start each with a strong action verb and include metrics when plausible.',
    `Improve these experience bullets:\n\n${description}`,
  )
  return result || description
}

export async function aiImproveSkillCategories(
  categories: SkillCategory[],
  resume: ResumeData,
): Promise<SkillCategory[]> {
  if (!hasOpenAiKey()) return improveSkillCategories(categories)

  const current = formatSkillsForExport(categories)
  const result = await callOpenAi(
    'You improve resume skill sections. Return ONLY categorized skills in this exact format, one category per line: "Category Name: skill1, skill2, skill3". Use these categories when possible: Languages, Frontend Development, Backend Development, Database Management, Tools & Software. Standardize names (e.g. JavaScript (ES6+), React.js, Node.js). No markdown or extra text.',
    `Improve these resume skills for a ${resume.personalInfo.role || resume.personalInfo.candidateType || 'professional'} candidate:\n\n${current || getSkillsContextForAi(resume)}`,
  )

  if (!result) return improveSkillCategories(categories)

  const parsed = result
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([^:]{2,40}):\s*(.+)$/)
      if (!match) return null
      return { name: match[1].trim(), skills: match[2].trim() }
    })
    .filter(Boolean) as { name: string; skills: string }[]

  if (parsed.length === 0) return improveSkillCategories(categories)

  return categories.map((cat) => {
    const found =
      parsed.find((p) => p.name.toLowerCase() === cat.name.toLowerCase()) ??
      parsed.find((p) => cat.name.toLowerCase().includes(p.name.toLowerCase().slice(0, 8)))
    return found ? { ...cat, skills: found.skills } : improveSkillCategories([cat])[0]
  })
}
