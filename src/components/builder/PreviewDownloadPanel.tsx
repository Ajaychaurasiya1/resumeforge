import { useMemo, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { PreviewPanel } from '../PreviewPanel'
import { SettingsPanel } from '../SettingsPanel'
import { getTemplateMeta } from '../../templates/registry'
import {
  Download,
  FileText,
  CheckCircle2,
  FileType,
  Loader2,
  Ruler,
  Mail,
  Layers,
} from 'lucide-react'
import { getCompletionStats } from '../../utils/builderSteps'
import { hasSkillContent } from '../../utils/skills'
import { estimatePageCount } from '../../utils/pageLength'
import { AtsScorePanel } from './AtsScorePanel'
import { ApplicationTrackerPanel } from './ApplicationTrackerPanel'
import { JobMatcherPanel } from './JobMatcherPanel'
import { ShareLinkPanel } from './ShareLinkPanel'
import { MultiResumePanel } from './MultiResumePanel'
import { SnapshotPanel } from './SnapshotPanel'
import { SnapshotComparePanel } from './SnapshotComparePanel'
import { IndustryPackPanel } from './IndustryPackPanel'
import { AccessibilityPanel } from './AccessibilityPanel'
import { QrCodePanel } from './QrCodePanel'
import { AiSettingsPanel } from './AiSettingsPanel'
import { TemplatePicker } from './TemplatePicker'

export function PreviewDownloadPanel() {
  const {
    resume,
    updateResume,
    exportJson,
    exportPdfFile,
    exportDocxFile,
    exportCombinedPdfFile,
    exportCoverLetterPdfFile,
    exportCoverLetterDocxFile,
    exportApplicationKitZipFile,
    exportApplicationKitPdfFile,
    updateSettings,
  } = useResume()
  const [exporting, setExporting] = useState<
    'pdf' | 'docx' | 'combined' | 'cover-pdf' | 'cover-docx' | 'kit-zip' | 'kit-pdf' | null
  >(null)
  const meta = getTemplateMeta(resume.template)
  const { completed, total, percent } = getCompletionStats(resume)
  const pageEstimate = useMemo(() => estimatePageCount(resume), [resume])

  const pageStatusColor =
    pageEstimate.status === 'good'
      ? 'text-emerald-400'
      : pageEstimate.status === 'warning'
        ? 'text-amber-400'
        : 'text-rose-400'

  const filledSections = [
    resume.personalInfo.fullName && 'Personal details',
    resume.summary.trim() && 'Summary',
    hasSkillContent(resume.skillCategories) && 'Skills',
    resume.experience.some((e) => e.company || e.position) && 'Experience',
    resume.projects.some((p) => p.name) && 'Projects',
    resume.education.some((e) => e.institution || e.degree) && 'Education',
    resume.certifications.some((c) => c.name) && 'Certifications',
    resume.achievements.some((a) => a.title) && 'Achievements',
    resume.trainings.some((t) => t.title) && 'Trainings',
    resume.publications.some((p) => p.title) && 'Publications',
    resume.workshops.some((w) => w.title) && 'Workshops',
    resume.references.some((r) => r.name) && 'References',
    resume.hobbies.some((h) => h.name) && 'Hobbies',
    resume.customSections.some((s) => s.title || s.items.length) && 'Custom sections',
    resume.languages.some((l) => l.name) && 'Languages',
  ].filter(Boolean) as string[]

  const runExport = async (
    key: typeof exporting,
    fn: () => void | Promise<void>,
  ) => {
    setExporting(key)
    try {
      await fn()
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Preview & Download</h2>
        <p className="mt-1 text-sm text-slate-500">
          Customize formatting, review your resume, and export.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-violet-500" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-sm font-medium text-slate-400">
            {completed}/{total} complete
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MultiResumePanel />
        <SnapshotPanel />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AtsScorePanel />
        <AccessibilityPanel />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <JobMatcherPanel />
        <ApplicationTrackerPanel />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <IndustryPackPanel />
        <SnapshotComparePanel />
      </div>

      <ShareLinkPanel />

      <QrCodePanel />

      <AiSettingsPanel />

      <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Ruler size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-slate-300">Page Length</span>
          </div>
          <span className={`text-sm font-bold ${pageStatusColor}`}>
            ~{pageEstimate.pages} page{pageEstimate.pages === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Choose template
        </p>
        <p className="mt-1 text-xs text-slate-600">{meta.tagline}</p>
        <div className="mt-4">
          <TemplatePicker
            value={resume.template}
            role={resume.personalInfo.role}
            onChange={(template) => updateResume({ template })}
            onAccentPreset={(accent) => updateSettings({ accentColor: accent })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed sections
          </p>
          <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto">
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

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Export</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => runExport('pdf', exportPdfFile)}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
          >
            {exporting === 'pdf' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            ATS PDF (text)
          </button>
          <button
            onClick={() => runExport('combined', exportCombinedPdfFile)}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-60"
          >
            {exporting === 'combined' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Layers size={16} />
            )}
            Resume + Cover Letter PDF
          </button>
          <button
            onClick={() => runExport('kit-pdf', exportApplicationKitPdfFile)}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-60"
          >
            {exporting === 'kit-pdf' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Layers size={16} />
            )}
            Application Kit PDF
          </button>
          <button
            onClick={() => runExport('kit-zip', () => exportApplicationKitZipFile())}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-60"
          >
            {exporting === 'kit-zip' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Application Kit ZIP
          </button>
          <button
            onClick={() => runExport('docx', exportDocxFile)}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a27] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-60"
          >
            {exporting === 'docx' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileType size={16} />
            )}
            Export DOCX
          </button>
          <button
            onClick={() => runExport('cover-pdf', exportCoverLetterPdfFile)}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a27] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-60"
          >
            {exporting === 'cover-pdf' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            Cover Letter PDF
          </button>
          <button
            onClick={() => runExport('cover-docx', exportCoverLetterDocxFile)}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a27] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-60"
          >
            {exporting === 'cover-docx' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            Cover Letter DOCX
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a27] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            <FileText size={16} />
            Print layout
          </button>
          <button
            onClick={exportJson}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a27] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Save as JSON
          </button>
        </div>
        <p className="text-xs text-slate-600">
          ATS PDF uses selectable text (not a screenshot) for better parsing.
        </p>
      </div>

      <SettingsPanel dark />

      <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
        <div className="mb-3 flex items-center gap-2">
          <FileText size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-slate-300">Resume Preview</span>
        </div>
        <div className="builder-scrollbar max-h-[60vh] overflow-y-auto overscroll-contain">
          <PreviewPanel dark />
        </div>
      </div>
    </div>
  )
}
