import { useMemo } from 'react'
import { Accessibility, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { computeAccessibilityChecks, computeAccessibilityScore } from '../../utils/accessibilityScore'

export function AccessibilityPanel() {
  const { resume } = useResume()
  const checks = useMemo(() => computeAccessibilityChecks(resume), [resume])
  const score = computeAccessibilityScore(checks)

  const scoreColor =
    score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Accessibility size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-slate-300">Accessibility Score</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Structure, readability, and contrast checks</p>
        </div>
        <span className={`text-2xl font-bold ${scoreColor}`}>{score}%</span>
      </div>
      <ul className="mt-4 max-h-40 space-y-2 overflow-y-auto">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-2 text-sm">
            {check.passed ? (
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-500" />
            )}
            <div>
              <span className={check.passed ? 'text-slate-400' : 'text-slate-300'}>{check.label}</span>
              {!check.passed && <p className="text-xs text-slate-500">{check.tip}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
