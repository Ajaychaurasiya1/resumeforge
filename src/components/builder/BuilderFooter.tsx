import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BUILDER_STEPS, getStepIndex } from '../../utils/builderSteps'
import type { BuilderSection } from '../../utils/sectionConfig'

interface Props {
  active: BuilderSection
  onChange: (section: BuilderSection) => void
}

export function BuilderFooter({ active, onChange }: Props) {
  const index = getStepIndex(active)
  const prev = index > 0 ? BUILDER_STEPS[index - 1] : null
  const next = index < BUILDER_STEPS.length - 1 ? BUILDER_STEPS[index + 1] : null
  const current = BUILDER_STEPS[index]

  return (
    <footer className="shrink-0 border-t border-white/5 bg-[#0a0a12] px-4 py-3 lg:px-6">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
        <button
          type="button"
          disabled={!prev}
          onClick={() => prev && onChange(prev.id)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <p className="hidden text-sm text-slate-500 sm:block">
          Editing <span className="font-medium text-slate-300">{current?.label}</span>
        </p>

        <button
          type="button"
          disabled={!next}
          onClick={() => next && onChange(next.id)}
          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </footer>
  )
}
