import type { Experience } from '../types/resume'
import { extractKeywords } from './jobMatcher'

export interface BulletSuggestion {
  id: string
  text: string
  reason: string
  experienceId?: string
}

const THEME_PATTERNS: { keywords: RegExp; bullets: string[]; reason: string }[] = [
  {
    keywords: /lead|leadership|manage|mentor|supervis|team lead/i,
    bullets: [
      'Led cross-functional team initiatives and coordinated deliverables across stakeholders.',
      'Mentored junior team members and established best practices for the group.',
    ],
    reason: 'Job mentions leadership',
  },
  {
    keywords: /agile|scrum|sprint|kanban/i,
    bullets: [
      'Participated in agile ceremonies and delivered incremental value each sprint.',
      'Collaborated with product owners to refine backlog items and acceptance criteria.',
    ],
    reason: 'Job mentions agile workflows',
  },
  {
    keywords: /communicat|present|stakeholder|client|customer/i,
    bullets: [
      'Presented project updates to stakeholders and incorporated feedback into roadmaps.',
      'Communicated technical concepts clearly to non-technical partners.',
    ],
    reason: 'Job emphasizes communication',
  },
  {
    keywords: /scale|performance|optimi|latency|throughput/i,
    bullets: [
      'Improved system performance through profiling, optimization, and targeted refactoring.',
      'Scaled services to handle increased traffic while maintaining reliability.',
    ],
    reason: 'Job mentions performance or scale',
  },
  {
    keywords: /collaborat|cross.?functional|partner/i,
    bullets: [
      'Partnered with design, product, and engineering teams to ship features on schedule.',
      'Built strong cross-functional relationships to unblock dependencies early.',
    ],
    reason: 'Job emphasizes collaboration',
  },
  {
    keywords: /data|analytics|metric|kpi|insight/i,
    bullets: [
      'Used data and metrics to inform decisions and measure impact of key initiatives.',
      'Built dashboards and reports that surfaced actionable insights for leadership.',
    ],
    reason: 'Job mentions data or analytics',
  },
  {
    keywords: /security|compliance|privacy|gdpr|hipaa/i,
    bullets: [
      'Applied security and compliance standards throughout design and implementation.',
      'Partnered with compliance teams to meet regulatory requirements.',
    ],
    reason: 'Job mentions security or compliance',
  },
]

function experienceHasTheme(exp: Experience, pattern: RegExp): boolean {
  const text = `${exp.position} ${exp.company} ${exp.description}`.toLowerCase()
  return pattern.test(text)
}

function suggestionExists(description: string, bullet: string): boolean {
  return description.toLowerCase().includes(bullet.slice(0, 40).toLowerCase())
}

export function suggestBulletsFromJob(
  jobTitle: string,
  jobDescription: string,
  experience: Experience[],
  limit = 6,
): BulletSuggestion[] {
  const combined = `${jobTitle} ${jobDescription}`
  if (!combined.trim()) return []

  const keywords = extractKeywords(combined)
  const keywordBlob = keywords.join(' ').toLowerCase()
  const suggestions: BulletSuggestion[] = []
  const seen = new Set<string>()

  for (const theme of THEME_PATTERNS) {
    if (!theme.keywords.test(combined) && !theme.keywords.test(keywordBlob)) continue

    const targetExp =
      experience.find((e) => e.description && !experienceHasTheme(e, theme.keywords)) ??
      experience.find((e) => e.company || e.position)

    for (const bullet of theme.bullets) {
      if (seen.has(bullet) || suggestions.length >= limit) break
      if (targetExp?.description && suggestionExists(targetExp.description, bullet)) continue

      seen.add(bullet)
      suggestions.push({
        id: `${theme.reason}-${bullet.slice(0, 12)}`,
        text: bullet,
        reason: theme.reason,
        experienceId: targetExp?.id,
      })
    }
  }

  return suggestions.slice(0, limit)
}
