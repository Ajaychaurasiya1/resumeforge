import { useResume } from '../../context/ResumeContext'
import { PreviewPanel } from '../PreviewPanel'
import { SettingsPanel } from '../SettingsPanel'
import { TEMPLATE_REGISTRY, getTemplateMeta } from '../../templates/registry'
import { Download, Save, FileText, CheckCircle2 } from 'lucide-react'
import type { TemplateId } from '../../types/resume'

export function PreviewDownloadPanel() {
  const { resume, updateResume, exportJson } = useResume()
  const meta = getTemplateMeta(resume.template)

  const handlePrint = () => window.print()

  const filledSections = [
    resume.personalInfo.fullName && 'Personal details',
    resume.summary.trim() && 'Summary',
    resume.skills.length > 0 && 'Skills',
    resume.experience.some((e) => e.company || e.position) && 'Experience',
    resume.projects.some((p) => p.name) && 'Projects',
    resume.education.some((e) => e.institution || e.degree) && 'Education',
    resume.achievements.some((a) => a.title) && 'Achievements',
    resume.certifications.some((c) => c.name) && 'Certifications',
    resume.languages.some((l) => l.name) && 'Languages',
  ].filter(Boolean) as string[]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Preview & Download</h2>
        <p className="mt-1 text-sm text-slate-500">
          Review your resume and export when you&apos;re ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Template</p>
          <select
            value={resume.template}
            onChange={(e) => updateResume({ template: e.target.value as TemplateId })}
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-violet-500"
          >
            {TEMPLATE_REGISTRY.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">{meta.tagline}</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed sections
          </p>
          <ul className="mt-3 space-y-1.5">
            {filledSections.length > 0 ? (
              filledSections.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-500">Fill in sections to see progress here.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          <Download size={16} />
          Download PDF
        </button>
        <button
          onClick={exportJson}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a27] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
        >
          <Save size={16} />
          Save as JSON
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
        <div className="mb-3 flex items-center gap-2">
          <FileText size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-slate-300">Resume Preview</span>
        </div>
        <div className="builder-scrollbar max-h-[60vh] overflow-y-auto overscroll-contain">
          <PreviewPanel dark />
        </div>
      </div>

      <SettingsPanel dark />
    </div>
  )
}
