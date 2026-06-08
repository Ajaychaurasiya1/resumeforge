import type { TemplateId } from '../types/resume'
import { TEMPLATE_REGISTRY } from '../templates/registry'

const ROLE_RULES: { pattern: RegExp; templates: TemplateId[] }[] = [
  {
    pattern: /engineer|developer|software|devops|data sci|programmer|full.?stack|backend|frontend/i,
    templates: ['technical', 'split', 'startup'],
  },
  {
    pattern: /design|creative|marketing|brand|ux|ui|media|advertis/i,
    templates: ['creative', 'minimal', 'bold'],
  },
  {
    pattern: /law|legal|attorney|compliance|paralegal|counsel/i,
    templates: ['legal', 'classic', 'executive'],
  },
  {
    pattern: /doctor|nurse|health|medical|clinical|pharm/i,
    templates: ['chronological', 'professional', 'compact'],
  },
  {
    pattern: /research|phd|faculty|professor|academic|postdoc/i,
    templates: ['academic', 'harvard', 'elegant'],
  },
  {
    pattern: /executive|director|vp|c-suite|ceo|cto|manager|leadership/i,
    templates: ['executive', 'corporate', 'bold'],
  },
  {
    pattern: /intern|fresher|student|graduate|entry/i,
    templates: ['minimal', 'modern', 'compact'],
  },
  {
    pattern: /consult|product|operations|business analyst/i,
    templates: ['professional', 'metro', 'split'],
  },
  {
    pattern: /finance|bank|account|investment|analyst/i,
    templates: ['corporate', 'classic', 'professional'],
  },
]

export function recommendTemplates(role: string, limit = 3): TemplateId[] {
  const trimmed = role.trim()
  if (!trimmed) return ['professional', 'modern', 'minimal']

  for (const rule of ROLE_RULES) {
    if (rule.pattern.test(trimmed)) return rule.templates.slice(0, limit)
  }

  return ['professional', 'modern', 'minimal']
}

export function getRecommendedTemplateMeta(role: string) {
  return recommendTemplates(role).map((id) => TEMPLATE_REGISTRY.find((t) => t.id === id)!)
}
