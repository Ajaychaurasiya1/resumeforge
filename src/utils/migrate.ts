import {
  defaultResumeData,
  defaultSettings,
  type ResumeData,
  type ResumeSettings,
  type TemplateId,
} from '../types/resume'
import { isValidTemplate } from '../templates/registry'

export function migrateResumeData(raw: unknown): ResumeData {
  const defaults = defaultResumeData()
  if (!raw || typeof raw !== 'object') return defaults

  const data = raw as Partial<ResumeData>
  const settings = migrateSettings(data.settings)

  return {
    personalInfo: { ...defaults.personalInfo, ...data.personalInfo },
    summary: data.summary ?? defaults.summary,
    experience: data.experience?.length ? data.experience : defaults.experience,
    education: data.education?.length ? data.education : defaults.education,
    skills: data.skills ?? defaults.skills,
    projects: data.projects ?? defaults.projects,
    achievements: data.achievements ?? defaults.achievements,
    certifications: data.certifications ?? defaults.certifications,
    languages: data.languages ?? defaults.languages,
    template: isValidTemplate(data.template as string)
      ? (data.template as TemplateId)
      : defaults.template,
    settings,
  }
}

function migrateSettings(raw: Partial<ResumeSettings> | undefined): ResumeSettings {
  const defaults = defaultSettings()
  if (!raw) return defaults

  return {
    accentColor: raw.accentColor ?? defaults.accentColor,
    fontSize: raw.fontSize ?? defaults.fontSize,
    sectionOrder: raw.sectionOrder?.length ? raw.sectionOrder : defaults.sectionOrder,
    hiddenSections: raw.hiddenSections ?? defaults.hiddenSections,
  }
}
