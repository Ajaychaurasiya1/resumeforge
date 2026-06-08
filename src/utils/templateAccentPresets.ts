import type { AccentColor, TemplateId } from '../types/resume'

/** Fixed accent colors that suit specific template identities. */
export const TEMPLATE_ACCENT_PRESETS: Partial<Record<TemplateId, AccentColor>> = {
  corporate: 'slate',
  europass: 'blue',
  legal: 'slate',
  executive: 'slate',
  harvard: 'slate',
  academic: 'slate',
  startup: 'indigo',
  technical: 'indigo',
  bold: 'indigo',
}

export function getTemplateAccentPreset(template: TemplateId): AccentColor | null {
  return TEMPLATE_ACCENT_PRESETS[template] ?? null
}
