const BULLET_RE = /^[-•*●○▪►]\s+/

const ACTION_VERBS = [
  'Achieved', 'Built', 'Created', 'Delivered', 'Designed', 'Developed',
  'Drove', 'Enhanced', 'Established', 'Executed', 'Generated', 'Implemented',
  'Improved', 'Increased', 'Led', 'Managed', 'Optimized', 'Reduced',
  'Spearheaded', 'Streamlined', 'Transformed',
]

const WEAK_OPENERS =
  /^(?:i\s+(?:was|am|have\s+been|worked|helped|assisted|supported)|responsible\s+for|worked\s+on|helped\s+with|involved\s+in|duties\s+included|tasked\s+with|in\s+charge\s+of)\b[:\s]*/i

const FILLER_WORDS =
  /\b(?:very|really|just|basically|actually|simply|quite|rather|somewhat|extremely|highly|significantly|successfully|effectively|efficiently)\b/gi

const REDUNDANT_PHRASES: [RegExp, string][] = [
  [/\bin\s+order\s+to\b/gi, 'to'],
  [/\bdue\s+to\s+the\s+fact\s+that\b/gi, 'because'],
  [/\bat\s+this\s+point\s+in\s+time\b/gi, 'now'],
  [/\bfor\s+the\s+purpose\s+of\b/gi, 'to'],
  [/\bwith\s+regard\s+to\b/gi, 'regarding'],
  [/\butilize\b/gi, 'use'],
  [/\butilized\b/gi, 'used'],
  [/\butilizing\b/gi, 'using'],
  [/\bleverage\b/gi, 'use'],
  [/\bleveraged\b/gi, 'used'],
  [/\bleveraging\b/gi, 'using'],
  [/\bsynerg(?:y|ies|ize|ized|izing)\b/gi, 'collaborate'],
]

const PASSIVE_PATTERNS: [RegExp, (match: string, ...groups: string[]) => string][] = [
  [
    /^was\s+responsible\s+for\s+(.+)/i,
    (_, rest) => `Led ${lowerFirst(rest)}`,
  ],
  [
    /^were\s+responsible\s+for\s+(.+)/i,
    (_, rest) => `Led ${lowerFirst(rest)}`,
  ],
  [
    /^helped\s+(?:to\s+)?(.+)/i,
    (_, rest) => `Supported ${lowerFirst(rest)}`,
  ],
  [
    /^worked\s+(?:on|with)\s+(.+)/i,
    (_, rest) => `Collaborated on ${lowerFirst(rest)}`,
  ],
]

const SUMMARY_WEAK_START =
  /^(?:i\s+am\s+(?:a|an)|i'm\s+(?:a|an)|i\s+have\s+(?:a|over|more\s+than)?|my\s+name\s+is|this\s+is)\s+/i

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function lowerFirst(text: string): string {
  const t = text.trim()
  if (!t) return t
  return t.charAt(0).toLowerCase() + t.slice(1)
}

function capitalizeFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function startsWithActionVerb(text: string): boolean {
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  return ACTION_VERBS.some((verb) => verb.toLowerCase() === firstWord)
}

function pickVerb(text: string): string {
  const lower = text.toLowerCase()
  if (/develop|code|build|engineer|program|software|api/.test(lower)) return 'Developed'
  if (/design|ui|ux|wireframe|prototype/.test(lower)) return 'Designed'
  if (/manage|lead|team|direct|supervis|mentor/.test(lower)) return 'Led'
  if (/improve|optim|enhanc|streamlin|refactor/.test(lower)) return 'Improved'
  if (/reduce|decreas|cut|lower|cost/.test(lower)) return 'Reduced'
  if (/increase|grow|expand|boost|scale/.test(lower)) return 'Increased'
  if (/implement|deploy|launch|integrat|automat/.test(lower)) return 'Implemented'
  if (/analy|research|data|insight/.test(lower)) return 'Analyzed'
  if (/market|sales|client|customer|revenue/.test(lower)) return 'Drove'
  return 'Delivered'
}

function cleanWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/\s+([,.;])/g, '$1').trim()
}

function applyRedundantPhrases(text: string): string {
  let result = text
  for (const [pattern, replacement] of REDUNDANT_PHRASES) {
    result = result.replace(pattern, replacement)
  }
  return result
}

function removeFiller(text: string): string {
  return cleanWhitespace(text.replace(FILLER_WORDS, ''))
}

function applyPassiveFixes(text: string): string {
  let result = text.trim()
  for (const [pattern, replacer] of PASSIVE_PATTERNS) {
    const match = result.match(pattern)
    if (match) {
      result = replacer(match[0], ...match.slice(1))
      break
    }
  }
  return result
}

function stripWeakOpener(text: string): string {
  let result = text.trim()
  if (WEAK_OPENERS.test(result)) {
    result = result.replace(WEAK_OPENERS, '').trim()
    result = capitalizeFirst(result)
  }
  return result
}

function ensureActionVerb(text: string): string {
  if (startsWithActionVerb(text)) return text
  const verb = pickVerb(text)
  const rest = text.trim()
  return `${verb} ${lowerFirst(rest)}`
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Drop lowest-value trailing sentences until within word limit. */
function condenseToWordLimit(text: string, maxWords: number): string {
  const sentences = splitSentences(text)
  if (sentences.length === 0) return text

  let combined = sentences.join(' ')
  if (wordCount(combined) <= maxWords) return combined

  // Prefer keeping first sentence (core identity) and trim from the end
  const kept: string[] = []
  for (const sentence of sentences) {
    const candidate = [...kept, sentence].join(' ')
    if (wordCount(candidate) <= maxWords) {
      kept.push(sentence)
    } else if (kept.length === 0) {
      // Single long sentence — trim by removing filler clauses, not hard cut
      const words = removeFiller(sentence).split(/\s+/).filter(Boolean)
      kept.push(words.slice(0, maxWords).join(' '))
      break
    } else {
      break
    }
  }

  combined = kept.join(' ')
  if (wordCount(combined) > maxWords) {
    combined = combined.split(/\s+/).slice(0, maxWords).join(' ')
  }

  return combined.replace(/\s*[,.]$/, '.').trim()
}

function buildSummaryOpening(text: string): string {
  const roleMatch = text.match(
    /\b((?:senior|lead|staff|principal|junior|mid[- ]level)?\s*(?:software|full[- ]stack|front[- ]end|back[- ]end|data|devops|product|project|marketing|sales|financial|business|hr|operations)?\s*(?:engineer|developer|designer|manager|analyst|consultant|specialist|director|architect|scientist|coordinator|administrator))\b/i,
  )

  const yearsMatch = text.match(/(\d+\+?)\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience)?/i)

  if (roleMatch && yearsMatch) {
    const role = roleMatch[1].trim()
    const years = yearsMatch[1]
    const rest = text
      .replace(roleMatch[0], '')
      .replace(yearsMatch[0], '')
      .replace(SUMMARY_WEAK_START, '')
      .trim()

    const core = rest ? ` ${lowerFirst(removeFiller(stripWeakOpener(rest)))}` : ''
    return capitalizeFirst(
      `${role} with ${years}+ years of experience${core.endsWith('.') ? core : core ? `. ${capitalizeFirst(core)}` : '.'}`,
    )
  }

  if (roleMatch) {
    const role = roleMatch[1].trim()
    const rest = text.replace(roleMatch[0], '').replace(SUMMARY_WEAK_START, '').trim()
    const cleaned = capitalizeFirst(stripWeakOpener(removeFiller(rest)))
    return capitalizeFirst(`${role} with a proven track record in ${lowerFirst(cleaned)}`)
  }

  return capitalizeFirst(stripWeakOpener(text.replace(SUMMARY_WEAK_START, '')))
}

export function improveBullet(line: string): string {
  let text = line.trim().replace(BULLET_RE, '').trim()
  if (!text) return line

  text = applyRedundantPhrases(text)
  text = removeFiller(text)
  text = applyPassiveFixes(text)
  text = stripWeakOpener(text)
  text = ensureActionVerb(text)
  text = cleanWhitespace(text)

  // Ensure bullet ends cleanly (no trailing metric placeholders)
  if (!/[.!?]$/.test(text) && text.length > 60) {
    text += '.'
  }

  return text
}

export function improveSummary(text: string): string {
  const original = text.trim()
  if (!original) return text

  let summary = original
  summary = removeFiller(summary)
  summary = summary.replace(SUMMARY_WEAK_START, '')
  summary = applyPassiveFixes(summary)
  summary = cleanWhitespace(summary)

  // Restructure weak openings into a professional lead
  if (/^(?:i\s|my\s)/i.test(summary) || !startsWithActionVerb(summary)) {
    summary = buildSummaryOpening(summary)
  }

  summary = cleanWhitespace(summary)

  // Condense by sentence priority, not character truncation
  if (wordCount(summary) > 80) {
    summary = condenseToWordLimit(summary, 80)
  }

  // Expand thin summaries with structure (same word budget, no append spam)
  if (wordCount(summary) < 20 && wordCount(original) >= 8) {
    const roleMatch = original.match(
      /\b((?:senior|lead|staff|principal|junior)?\s*\w+\s*(?:engineer|developer|designer|manager|analyst|consultant|specialist|director|architect|scientist))\b/i,
    )
    const skillsMatch = original.match(
      /(?:skilled|experienced|proficient|expert)\s+(?:in|with|at)\s+([^.]+)/i,
    )

    if (roleMatch) {
      const role = roleMatch[1]
      const skills = skillsMatch?.[1]?.trim()
      summary = skills
        ? `${capitalizeFirst(role)} specializing in ${lowerFirst(skills)}, focused on delivering measurable business impact.`
        : `${capitalizeFirst(role)} focused on delivering high-quality results and continuous improvement.`
    }
  }

  summary = cleanWhitespace(summary)

  // Final punctuation
  if (summary && !/[.!?]$/.test(summary)) {
    summary += '.'
  }

  return summary
}
