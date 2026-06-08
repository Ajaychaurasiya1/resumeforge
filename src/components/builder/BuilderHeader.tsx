import { Link } from 'react-router-dom'
import { Download, Sparkles } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { getTemplateMeta } from '../../templates/registry'
import {
  getCompletionStats,
  getGroupForSection,
} from '../../utils/builderSteps'
import type { BuilderSection } from '../../utils/sectionConfig'
import { AutoSaveIndicator } from './AutoSaveIndicator'
import { TemplatePicker } from './TemplatePicker'

interface Props {
  activeSection: BuilderSection
  onNewResume: () => void
}

export function BuilderHeader({ activeSection, onNewResume }: Props) {
  const { resume, updateResume, exportPdfFile } = useResume()
  const { completed, total, percent, minutesLeft } = getCompletionStats(resume)
  const group = getGroupForSection(activeSection)
  const meta = getTemplateMeta(resume.template)

  return (
    <header className="shrink-0 border-b border-white/5 bg-[#08080f]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">ResumeForge</p>
              <p className="text-[10px] font-medium text-violet-400">Free Resume Builder</p>
            </div>
          </Link>
          <button
            onClick={onNewResume}
            className="hidden rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-500 transition hover:bg-white/5 hover:text-slate-300 sm:inline"
          >
            New resume
          </button>
        </div>

        <div className="hidden flex-1 flex-col items-center px-4 md:flex">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-300">{group.label}</span>
            <span>·</span>
            <span>
              {completed} of {total} sections
            </span>
            <span>·</span>
            <span>~{minutesLeft} min left</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AutoSaveIndicator />
          <span className="hidden rounded-lg border border-white/10 bg-[#1a1a27] px-3 py-2 text-xs text-slate-400 lg:inline">
            {meta.name}
          </span>
          <button
            onClick={() => exportPdfFile()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <Download size={15} />
            <span className="hidden sm:inline">ATS PDF</span>
          </button>
        </div>
      </div>

      {activeSection === 'preview' && (
        <div className="border-t border-white/5 px-4 py-3 lg:hidden">
          <TemplatePicker
            compact
            value={resume.template}
            onChange={(template) => updateResume({ template })}
          />
        </div>
      )}
    </header>
  )
}
