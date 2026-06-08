import { sampleResumeData, type ResumeData, type TemplateId } from '../types/resume'

/** Stable sample used for template thumbnail previews (generated once). */
export const TEMPLATE_PREVIEW_SAMPLE: ResumeData = sampleResumeData()

export function getTemplatePreviewData(templateId: TemplateId): ResumeData {
  return { ...TEMPLATE_PREVIEW_SAMPLE, template: templateId }
}

/** Letter page width used for scaling mini previews. */
export const PREVIEW_PAGE_WIDTH = 816
