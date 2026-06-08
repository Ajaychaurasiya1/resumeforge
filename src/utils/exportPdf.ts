import { exportTextPdf } from './exportTextPdf'
import type { ResumeData } from '../types/resume'

/** ATS-friendly text-based PDF (selectable text, not a screenshot). */
export async function exportPdf(data: ResumeData, filename = 'resume.pdf'): Promise<void> {
  exportTextPdf(data, filename)
}
