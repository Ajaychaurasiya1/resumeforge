import { AlignLeft, Loader2, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { aiImproveSummary, hasOpenAiKey } from '../../utils/aiRewrite'
import { improveSummary } from '../../utils/smartRewrite'
import { SectionCard } from '../SectionCard'
import { Textarea } from '../ui/FormFields'

const MIN_WORDS = 20
const MAX_WORDS = 80

export function SummaryForm({ inline = false }: { inline?: boolean }) {
  const { resume, updateResume } = useResume()
  const [loading, setLoading] = useState(false)

  const wordCount = useMemo(
    () => resume.summary.trim().split(/\s+/).filter(Boolean).length,
    [resume.summary],
  )

  const wordStatus =
    wordCount === 0
      ? 'text-slate-500'
      : wordCount >= MIN_WORDS && wordCount <= MAX_WORDS
        ? 'text-emerald-400'
        : 'text-amber-400'

  const handleImprove = async () => {
    setLoading(true)
    try {
      const next = hasOpenAiKey()
        ? await aiImproveSummary(resume)
        : improveSummary(resume.summary)
      updateResume({ summary: next })
    } finally {
      setLoading(false)
    }
  }

  const fields = (
    <div>
      <Textarea
        label="Summary"
        rows={4}
        value={resume.summary}
        onChange={(e) => updateResume({ summary: e.target.value })}
        placeholder="A brief overview of your professional background and key strengths..."
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className={`text-xs ${wordStatus}`}>
          {wordCount} words · aim for {MIN_WORDS}–{MAX_WORDS} words for ATS
        </p>
        <button
          type="button"
          onClick={handleImprove}
          disabled={!resume.summary.trim() || loading}
          className="inline-flex items-center gap-1 rounded-lg border border-violet-500/30 px-2.5 py-1 text-xs text-violet-300 hover:bg-violet-500/10 disabled:opacity-40"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {hasOpenAiKey() ? 'AI rewrite' : 'Smart rewrite'}
        </button>
      </div>
    </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Professional Summary" icon={<AlignLeft size={16} />}>
      {fields}
    </SectionCard>
  )
}
