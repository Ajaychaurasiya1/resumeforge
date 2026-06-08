import { useMemo, useState } from 'react'
import { useResume } from '../context/ResumeContext'
import { ResumeTemplate } from './templates/ResumeTemplate'
import { getTemplateMeta } from '../templates/registry'
import {
  highlightKeywordsInText,
  loadJobKeywords,
  renderHighlightedHtml,
} from '../utils/keywordHighlight'
import { getFlatSkills } from '../utils/skills'
import { estimatePageCount } from '../utils/pageLength'

export function PreviewPanel({ dark = false }: { dark?: boolean }) {
  const { resume } = useResume()
  const meta = getTemplateMeta(resume.template)
  const pageEstimate = useMemo(() => estimatePageCount(resume), [resume])
  const [showHighlights, setShowHighlights] = useState(true)
  const keywords = loadJobKeywords()

  const highlightSample = useMemo(() => {
    if (!keywords.length) return ''
    const text = [resume.summary, getFlatSkills(resume.skillCategories).join(', ')].filter(Boolean).join(' · ')
    return renderHighlightedHtml(highlightKeywordsInText(text, keywords))
  }, [resume.summary, resume.skillCategories, keywords])

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <h2 className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>
          Preview
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              pageEstimate.status === 'good'
                ? dark
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-emerald-50 text-emerald-700'
                : pageEstimate.status === 'warning'
                  ? dark
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-amber-50 text-amber-700'
                  : dark
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-rose-50 text-rose-700'
            }`}
          >
            ~{pageEstimate.pages} page{pageEstimate.pages === 1 ? '' : 's'}
          </span>
          {keywords.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHighlights((v) => !v)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                showHighlights
                  ? 'bg-amber-500/20 text-amber-300'
                  : dark
                    ? 'bg-white/5 text-slate-500'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              Keyword highlights
            </button>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              dark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-50 text-violet-700'
            }`}
          >
            {meta.name}
          </span>
        </div>
      </div>

      {showHighlights && highlightSample && (
        <div
          className={`mb-3 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
            dark ? 'border-amber-500/20 bg-amber-500/5 text-slate-400' : 'border-amber-200 bg-amber-50 text-slate-600'
          }`}
          dangerouslySetInnerHTML={{ __html: highlightSample }}
        />
      )}

      <div
        className={`flex-1 overflow-auto rounded-2xl border p-3 sm:p-4 ${
          dark ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-100/80'
        }`}
      >
        <div
          id="resume-preview"
          className="mx-auto w-full max-w-[816px] bg-white p-6 shadow-md sm:p-8"
          style={{ minHeight: '480px', aspectRatio: '8.5 / 11' }}
        >
          <ResumeTemplate data={resume} />
        </div>
      </div>
    </div>
  )
}
