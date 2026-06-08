import { useEffect, useState } from 'react'
import { Target } from 'lucide-react'

export function AtsScoreDemo() {
  const [score, setScore] = useState(45)

  useEffect(() => {
    const start = window.setTimeout(() => setScore(85), 1200)
    return () => window.clearTimeout(start)
  }, [])

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f0f18] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Before → After
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Sample score after adding job keywords to skills & summary
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Target size={18} className="text-emerald-400" />
          <span
            className={`text-3xl font-bold transition-all duration-700 ${
              score >= 80 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {score}%
          </span>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs text-rose-300">
          Before: missing React, TypeScript, CI/CD
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
          After: keywords added · job title aligned
        </div>
      </div>
    </div>
  )
}
