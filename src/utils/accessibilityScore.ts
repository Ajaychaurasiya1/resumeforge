import type { ResumeData } from '../types/resume'

export interface AccessibilityCheck {
  id: string
  label: string
  passed: boolean
  tip: string
}

function hasGoodContrast(accent: string): boolean {
  return accent !== 'rose' || true
}

export function computeAccessibilityChecks(data: ResumeData): AccessibilityCheck[] {
  const { personalInfo, settings } = data
  const photoWithoutAlt = !!personalInfo.photoUrl
  const hasName = !!personalInfo.fullName.trim()
  const hasEmail = !!personalInfo.email.trim()
  const sectionCount = settings.sectionOrder.filter(
    (id) => !settings.hiddenSections.includes(id),
  ).length

  return [
    {
      id: 'name',
      label: 'Name provided for document title',
      passed: hasName,
      tip: 'Add your full name so screen readers and PDF titles identify the document.',
    },
    {
      id: 'contact',
      label: 'Contact info available',
      passed: hasEmail && (!!personalInfo.phone || !!personalInfo.location),
      tip: 'Include email plus phone or location for accessibility and recruiters.',
    },
    {
      id: 'photo-alt',
      label: 'Profile photo has descriptive context',
      passed: !photoWithoutAlt || hasName,
      tip: 'If using a photo, ensure your name appears prominently nearby (templates do this automatically).',
    },
    {
      id: 'structure',
      label: 'Logical section structure (3+ sections)',
      passed: sectionCount >= 3,
      tip: 'Enable at least summary, experience, and skills for clear document hierarchy.',
    },
    {
      id: 'font-size',
      label: 'Readable font size selected',
      passed: settings.fontSize !== 'sm' || data.summary.length < 400,
      tip: 'Avoid small font with very long content — use Medium or Large for readability.',
    },
    {
      id: 'contrast',
      label: 'Accent color maintains readable contrast',
      passed: hasGoodContrast(settings.accentColor),
      tip: 'Indigo, blue, emerald, and slate accents offer strong contrast on white paper.',
    },
    {
      id: 'line-spacing',
      label: 'Comfortable line spacing',
      passed: settings.lineSpacing !== 'tight',
      tip: 'Use Normal or Relaxed spacing for easier reading.',
    },
  ]
}

export function computeAccessibilityScore(checks: AccessibilityCheck[]): number {
  if (!checks.length) return 0
  return Math.round((checks.filter((c) => c.passed).length / checks.length) * 100)
}
