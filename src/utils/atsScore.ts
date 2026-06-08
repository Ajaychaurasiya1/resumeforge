import type { ResumeData } from '../types/resume'
import { extractKeywords, matchSkills, type SkillMatchResult } from './jobMatcher'
import { countFlatSkills, getFlatSkills } from './skills'

export interface AtsCheck {
  id: string
  label: string
  passed: boolean
  tip: string
  group?: 'profile' | 'job'
}

export function buildResumeSearchText(data: ResumeData): string {
  return [
    data.personalInfo.role,
    data.summary,
    ...getFlatSkills(data.skillCategories),
    ...data.experience.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...data.projects.map((p) => `${p.name} ${p.technologies} ${p.description}`),
    ...data.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
  ]
    .filter(Boolean)
    .join(' ')
}

export function computeAtsChecks(data: ResumeData): AtsCheck[] {
  const { personalInfo, summary, experience, education, skillCategories } = data

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
  const hasSkills = countFlatSkills(skillCategories) >= 5
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
      group: 'profile',
    },
    {
      id: 'summary',
      label: 'Professional summary (20–80 words)',
      passed: hasGoodSummary,
      tip: 'Write a concise summary highlighting your key strengths.',
      group: 'profile',
    },
    {
      id: 'experience',
      label: 'At least one work experience',
      passed: hasExperience,
      tip: 'Add your most relevant job with title and company.',
      group: 'profile',
    },
    {
      id: 'bullets',
      label: 'Experience with bullet points',
      passed: hasBulletPoints,
      tip: 'Use 2+ bullet points per role describing achievements.',
      group: 'profile',
    },
    {
      id: 'action-verbs',
      label: 'Action verbs in descriptions',
      passed: hasActionVerbs,
      tip: 'Start bullets with verbs like Led, Built, Improved, Achieved.',
      group: 'profile',
    },
    {
      id: 'education',
      label: 'Education section filled',
      passed: hasEducation,
      tip: 'Include your degree and institution.',
      group: 'profile',
    },
    {
      id: 'skills',
      label: 'At least 5 skills listed',
      passed: hasSkills,
      tip: 'Add technical and soft skills relevant to your target role.',
      group: 'profile',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn profile included',
      passed: hasLinkedIn,
      tip: 'Many recruiters look for your LinkedIn URL.',
      group: 'profile',
    },
  ]
}

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function buildJobSearchText(jobTitle: string, jobDescription: string): string {
  return [jobTitle.trim(), jobDescription.trim()].filter(Boolean).join('\n')
}

function resumeAlignsWithJobTitle(data: ResumeData, jobTitle: string): boolean {
  const target = normalizeForMatch(jobTitle)
  if (target.length < 2) return false

  const corpus = normalizeForMatch(
    [
      data.personalInfo.role,
      data.summary,
      ...data.experience.map((e) => e.position),
    ].join(' '),
  )

  const titleWords = target.split(' ').filter((w) => w.length > 2)
  if (titleWords.length === 0) return corpus.includes(target)

  const matched = titleWords.filter((word) => corpus.includes(word))
  return matched.length >= Math.ceil(titleWords.length * 0.5)
}

export function computeJobFitChecks(
  data: ResumeData,
  jobTitle: string,
  jobDescription: string,
  keywordMatch: SkillMatchResult,
): AtsCheck[] {
  const combinedJobText = buildJobSearchText(jobTitle, jobDescription)
  const keywords = extractKeywords(combinedJobText)
  const keywordCount = keywords.length
  const trimmedTitle = jobTitle.trim()

  return [
    {
      id: 'job-title',
      label: 'Target job profile provided',
      passed: trimmedTitle.length >= 2,
      tip: 'Enter the role you are applying for, e.g. Software Engineer or Marketing Intern.',
      group: 'job',
    },
    {
      id: 'job-title-match',
      label: `Resume aligns with "${trimmedTitle || 'job profile'}"`,
      passed: resumeAlignsWithJobTitle(data, trimmedTitle),
      tip: 'Add the target role to Personal Details or match it in your experience titles.',
      group: 'job',
    },
    {
      id: 'job-description',
      label: 'Job description includes extractable requirements',
      passed: jobDescription.trim().length >= 40 && keywordCount >= 5,
      tip: 'Paste the full job posting with skills, tools, and responsibilities listed.',
      group: 'job',
    },
    {
      id: 'job-keywords',
      label: `Keywords matched (${keywordMatch.matched.length}/${keywordCount || 0})`,
      passed: keywordCount > 0 && keywordMatch.score >= 50,
      tip: 'Add missing skills and terms from the job description to your resume.',
      group: 'job',
    },
    {
      id: 'job-strong-match',
      label: 'Strong job alignment (70%+ keyword match)',
      passed: keywordCount > 0 && keywordMatch.score >= 70,
      tip: 'Weave important job requirements into your summary and experience bullets.',
      group: 'job',
    },
  ]
}

export interface AtsAnalysisResult {
  score: number
  profileScore: number
  jobMatchScore: number
  profileChecks: AtsCheck[]
  jobChecks: AtsCheck[]
  allChecks: AtsCheck[]
  keywordMatch: SkillMatchResult
  keywords: string[]
  jobTitle: string
}

export function computeAtsAnalysis(
  data: ResumeData,
  jobTitle: string,
  jobDescription: string,
): AtsAnalysisResult {
  const profileChecks = computeAtsChecks(data)
  const profileScore = computeAtsScore(profileChecks)

  const combinedJobText = buildJobSearchText(jobTitle, jobDescription)
  const keywords = extractKeywords(combinedJobText)
  const resumeText = buildResumeSearchText(data)
  const keywordMatch = matchSkills(getFlatSkills(data.skillCategories), resumeText, keywords)
  const jobChecks = computeJobFitChecks(data, jobTitle, jobDescription, keywordMatch)
  const jobMatchScore = keywordMatch.score

  const score = Math.round(profileScore * 0.4 + jobMatchScore * 0.6)
  const allChecks = [...profileChecks, ...jobChecks]

  return {
    score,
    profileScore,
    jobMatchScore,
    profileChecks,
    jobChecks,
    allChecks,
    keywordMatch,
    keywords,
    jobTitle: jobTitle.trim(),
  }
}

export function computeAtsScore(checks: AtsCheck[]): number {
  if (checks.length === 0) return 0
  const passed = checks.filter((c) => c.passed).length
  return Math.round((passed / checks.length) * 100)
}
