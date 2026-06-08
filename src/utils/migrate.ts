import {
  defaultResumeData,
  defaultSettings,
  DEFAULT_SECTION_ORDER,
  type CustomSection,
  type ResumeData,
  type ResumeSettings,
  type TemplateId,
} from '../types/resume'
import { isValidTemplate } from '../templates/registry'
import { migratePersonalInfo } from './personalInfo'
import { migrateSkillCategories } from './skills'

function mergeSectionOrder(raw: string[] | undefined): string[] {
  const order = raw?.length ? [...raw] : [...DEFAULT_SECTION_ORDER]
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!order.includes(id)) order.push(id)
  }
  return order
}

function migrateSettings(raw: Partial<ResumeSettings> | undefined, customSections: CustomSection[]): ResumeSettings {
  const defaults = defaultSettings()
  if (!raw) return defaults

  const sectionOrder = mergeSectionOrder(raw.sectionOrder as string[] | undefined)
  for (const section of customSections) {
    if (!sectionOrder.includes(section.id)) sectionOrder.push(section.id)
  }

  return {
    accentColor: raw.accentColor ?? defaults.accentColor,
    fontSize: raw.fontSize ?? defaults.fontSize,
    fontFamily: raw.fontFamily ?? defaults.fontFamily,
    lineSpacing: raw.lineSpacing ?? defaults.lineSpacing,
    sectionOrder,
    hiddenSections: raw.hiddenSections ?? defaults.hiddenSections,
  }
}

export function migrateResumeData(raw: unknown): ResumeData {
  const defaults = defaultResumeData()
  if (!raw || typeof raw !== 'object') return defaults

  const data = raw as Partial<ResumeData>
  const customSections = data.customSections ?? defaults.customSections
  const settings = migrateSettings(data.settings, customSections)

  return {
    personalInfo: migratePersonalInfo(data.personalInfo, defaults.personalInfo),
    summary: data.summary ?? defaults.summary,
    coverLetter: { ...defaults.coverLetter, ...(data.coverLetter ?? {}) },
    experience: data.experience?.length ? data.experience : defaults.experience,
    education: data.education?.length ? data.education : defaults.education,
    skillCategories: migrateSkillCategories(data as Partial<ResumeData> & { skills?: string[] }),
    projects: data.projects ?? defaults.projects,
    achievements: data.achievements ?? defaults.achievements,
    certifications: data.certifications ?? defaults.certifications,
    trainings: data.trainings ?? defaults.trainings,
    publications: data.publications ?? defaults.publications,
    workshops: data.workshops ?? defaults.workshops,
    references: data.references ?? defaults.references,
    hobbies: data.hobbies ?? defaults.hobbies,
    customSections,
    languages: data.languages ?? defaults.languages,
    template: isValidTemplate(data.template as string)
      ? (data.template as TemplateId)
      : defaults.template,
    settings,
  }
}
