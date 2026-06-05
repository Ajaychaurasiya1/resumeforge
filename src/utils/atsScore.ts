import type { ResumeData } from '../types/resume'

export interface AtsCheck {
  id: string
  label: string
  passed: boolean
  tip: string
}

export function computeAtsChecks(data: ResumeData): AtsCheck[] {
  const { personalInfo, summary, experience, education, skills } = data

  const hasContact =
    !!personalInfo.fullName &&
    !!personalInfo.email &&
    (!!personalInfo.phone || !!personalInfo.location)

  const summaryWordCount = summary.trim().split(/\s+/).filter(Boolean).length
  const hasGoodSummary = summaryWordCount >= 20 && summaryWordCount <= 80

  const filledExperience = experience.filter((e) => e.company && e.position)
  const hasExperience = filledExperience.length >= 1
  const hasBulletPoints = filledExperience.some((e) =>
    e.description.split('\n').filter((l) => l.trim()).length >= 2,
  )

  const hasEducation = education.some((e) => e.institution && e.degree)
  const hasSkills = skills.length >= 5
  const hasLinkedIn = !!personalInfo.linkedin

  const actionVerbs = [
    'led', 'built', 'developed', 'created', 'managed', 'designed',
    'implemented', 'improved', 'reduced', 'increased', 'achieved',
  ]
  const allText = experience.map((e) => e.description.toLowerCase()).join(' ')
  const hasActionVerbs = actionVerbs.some((v) => allText.includes(v))

  return [
    {
      id: 'contact',
      label: 'Complete contact information',
      passed: hasContact,
      tip: 'Include your full name, email, and phone or location.',
    },
    {
      id: 'summary',
      label: 'Professional summary (20–80 words)',
      passed: hasGoodSummary,
      tip: 'Write a concise summary highlighting your key strengths.',
    },
    {
      id: 'experience',
      label: 'At least one work experience',
      passed: hasExperience,
      tip: 'Add your most relevant job with title and company.',
    },
    {
      id: 'bullets',
      label: 'Experience with bullet points',
      passed: hasBulletPoints,
      tip: 'Use 2+ bullet points per role describing achievements.',
    },
    {
      id: 'action-verbs',
      label: 'Action verbs in descriptions',
      passed: hasActionVerbs,
      tip: 'Start bullets with verbs like Led, Built, Improved, Achieved.',
    },
    {
      id: 'education',
      label: 'Education section filled',
      passed: hasEducation,
      tip: 'Include your degree and institution.',
    },
    {
      id: 'skills',
      label: 'At least 5 skills listed',
      passed: hasSkills,
      tip: 'Add technical and soft skills relevant to your target role.',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn profile included',
      passed: hasLinkedIn,
      tip: 'Many recruiters look for your LinkedIn URL.',
    },
  ]
}

export function computeAtsScore(checks: AtsCheck[]): number {
  if (checks.length === 0) return 0
  const passed = checks.filter((c) => c.passed).length
  return Math.round((passed / checks.length) * 100)
}
