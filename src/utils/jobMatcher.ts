const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
  'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'that', 'this',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
  'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'any', 'our', 'your', 'their', 'its', 'my', 'his', 'her',
  'work', 'working', 'role', 'position', 'job', 'team', 'company', 'years', 'year',
  'experience', 'required', 'preferred', 'ability', 'strong', 'including', 'using',
])

const SKILL_PATTERNS = [
  /\b(?:javascript|typescript|python|java|c\+\+|c#|ruby|go|golang|rust|swift|kotlin|php|scala|r)\b/gi,
  /\b(?:react|angular|vue|svelte|next\.?js|node\.?js|express|django|flask|spring|\.net)\b/gi,
  /\b(?:aws|azure|gcp|docker|kubernetes|k8s|terraform|jenkins|ci\/cd|devops)\b/gi,
  /\b(?:sql|postgresql|mysql|mongodb|redis|graphql|rest|api)\b/gi,
  /\b(?:agile|scrum|jira|git|github|gitlab|linux|unix)\b/gi,
  /\b(?:machine learning|ml|ai|data science|nlp|deep learning)\b/gi,
  /\b(?:html|css|sass|tailwind|webpack|vite|babel)\b/gi,
  /\b(?:excel|powerpoint|word|salesforce|sap|tableau|power bi)\b/gi,
]

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9+#.]/g, '').trim()
}

function extractTokens(text: string): string[] {
  const tokens = new Set<string>()

  for (const pattern of SKILL_PATTERNS) {
    const matches = text.match(pattern) ?? []
    for (const match of matches) {
      const normalized = normalizeToken(match)
      if (normalized.length > 1) tokens.add(normalized)
    }
  }

  const words = text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ')
    .split(/\s+/)
    .map(normalizeToken)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

  for (const word of words) {
    tokens.add(word)
  }

  return [...tokens]
}

export function extractKeywords(jobText: string): string[] {
  if (!jobText.trim()) return []
  return extractTokens(jobText)
}

export interface SkillMatchResult {
  matched: string[]
  missing: string[]
  score: number
}

export function matchSkills(
  skills: string[],
  resumeText: string,
  keywords: string[],
): SkillMatchResult {
  if (keywords.length === 0) {
    return { matched: [], missing: [], score: 100 }
  }

  const corpus = [
    ...skills.map(normalizeToken),
    ...extractTokens(resumeText),
  ]
  const corpusSet = new Set(corpus)

  const matched: string[] = []
  const missing: string[] = []

  for (const keyword of keywords) {
    const normalized = normalizeToken(keyword)
    const found =
      corpusSet.has(normalized) ||
      [...corpusSet].some(
        (token) => token.includes(normalized) || normalized.includes(token),
      )

    if (found) matched.push(keyword)
    else missing.push(keyword)
  }

  const score = Math.round((matched.length / keywords.length) * 100)
  return { matched, missing, score }
}
