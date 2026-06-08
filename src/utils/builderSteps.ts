import type { ResumeData } from '../types/resume'
import { countFlatSkills } from './skills'
import type { BuilderSection } from './sectionConfig'

export interface BuilderStep {
  id: BuilderSection
  emoji: string
  label: string
  group: number
}

export const WORKFLOW_GROUPS = [
  { id: 1, label: 'Personal', description: 'Contact & summary' },
  { id: 2, label: 'Experience', description: 'Work & projects' },
  { id: 3, label: 'Education', description: 'Degrees & credentials' },
  { id: 4, label: 'Skills', description: 'Skills & interests' },
  { id: 5, label: 'Finish', description: 'Layout & download' },
] as const

export const BUILDER_STEPS: BuilderStep[] = [
  { id: 'personal', emoji: '👤', label: 'Personal', group: 1 },
  { id: 'summary', emoji: '📝', label: 'Summary', group: 1 },
  { id: 'experience', emoji: '💼', label: 'Experience', group: 2 },
  { id: 'projects', emoji: '📁', label: 'Projects', group: 2 },
  { id: 'achievements', emoji: '🏆', label: 'Achievements', group: 2 },
  { id: 'education', emoji: '🎓', label: 'Education', group: 3 },
  { id: 'certifications', emoji: '📜', label: 'Certifications', group: 3 },
  { id: 'trainings', emoji: '📚', label: 'Trainings', group: 3 },
  { id: 'publications', emoji: '📰', label: 'Publications', group: 3 },
  { id: 'workshops', emoji: '🎤', label: 'Workshops', group: 3 },
  { id: 'skills', emoji: '⚡', label: 'Skills', group: 4 },
  { id: 'languages', emoji: '🌐', label: 'Languages', group: 4 },
  { id: 'references', emoji: '👥', label: 'References', group: 4 },
  { id: 'hobbies', emoji: '❤️', label: 'Hobbies', group: 4 },
  { id: 'custom', emoji: '✨', label: 'Custom', group: 4 },
  { id: 'coverLetter', emoji: '✉️', label: 'Cover Letter', group: 5 },
  { id: 'preview', emoji: '📄', label: 'Download', group: 5 },
]

export const EDITOR_STEPS = BUILDER_STEPS.filter((s) => s.id !== 'preview')

export function isSectionComplete(id: BuilderSection, data: ResumeData): boolean {
  switch (id) {
    case 'personal':
      return !!(data.personalInfo.fullName && data.personalInfo.email)
    case 'summary':
      return data.summary.trim().length >= 20
    case 'skills':
      return countFlatSkills(data.skillCategories) >= 3
    case 'experience':
      return data.experience.some((e) => e.company && e.position)
    case 'projects':
      return data.projects.some((p) => p.name)
    case 'education':
      return data.education.some((e) => e.institution || e.degree)
    case 'certifications':
      return data.certifications.some((c) => c.name)
    case 'achievements':
      return data.achievements.some((a) => a.title)
    case 'trainings':
      return data.trainings.some((t) => t.title)
    case 'publications':
      return data.publications.some((p) => p.title)
    case 'workshops':
      return data.workshops.some((w) => w.title)
    case 'references':
      return data.references.some((r) => r.name)
    case 'hobbies':
      return data.hobbies.some((h) => h.name)
    case 'languages':
      return data.languages.some((l) => l.name)
    case 'custom':
      return data.customSections.some((s) => s.title && s.items.length > 0)
    case 'coverLetter':
      return data.coverLetter.body.trim().length >= 50
    case 'preview':
      return true
    default:
      return false
  }
}

export function getCompletionStats(data: ResumeData) {
  const visibleSteps = EDITOR_STEPS.filter((step) => {
    if (step.id === 'languages' && data.settings.hiddenSections.includes('languages')) return false
    if (step.id === 'custom' && data.customSections.length === 0) return false
    return true
  })
  const completed = visibleSteps.filter((s) => isSectionComplete(s.id, data)).length
  const total = visibleSteps.length
  const percent = total ? Math.round((completed / total) * 100) : 0
  const minutesLeft = Math.max(1, Math.ceil((total - completed) * 1.5))
  return { completed, total, percent, minutesLeft }
}

export function getStepIndex(id: BuilderSection): number {
  return BUILDER_STEPS.findIndex((s) => s.id === id)
}

export function getGroupForSection(id: BuilderSection): (typeof WORKFLOW_GROUPS)[number] {
  const step = BUILDER_STEPS.find((s) => s.id === id)
  return WORKFLOW_GROUPS.find((g) => g.id === step?.group) ?? WORKFLOW_GROUPS[0]
}
