import { AlertCircle, Briefcase, CheckCircle2, Target, User } from 'lucide-react'
import { useMemo } from 'react'
import { useResume } from '../../context/ResumeContext'
import { computeAtsAnalysis, computeAtsChecks, computeAtsScore, type AtsCheck } from '../../utils/atsScore'

function scoreColorClass(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-rose-400'
}

function CheckList({ checks, limit }: { checks: AtsCheck[]; limit?: number }) {
  const items = limit ? checks.slice(0, limit) : checks
  return (
    <ul className="space-y-2">
      {items.map((check) => (
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
  )
}

export function AtsScorePanel() {
  const { resume, jobTarget, updateJobTarget } = useResume()

  const jobTitleReady = jobTarget.jobTitle.trim().length >= 2
  const jobDescReady = jobTarget.jobDescription.trim().length >= 40
  const hasJobContext = jobTitleReady && jobDescReady

  const profileChecks = useMemo(() => computeAtsChecks(resume), [resume])
  const profileScoreBase = useMemo(() => computeAtsScore(profileChecks), [profileChecks])

  const analysis = useMemo(() => {
    if (!hasJobContext) return null
    return computeAtsAnalysis(resume, jobTarget.jobTitle, jobTarget.jobDescription)
  }, [resume, jobTarget.jobTitle, jobTarget.jobDescription, hasJobContext])

  const displayScore = analysis?.score ?? profileScoreBase
  const passed = (analysis?.allChecks ?? profileChecks).filter((c) => c.passed).length
  const total = (analysis?.allChecks ?? profileChecks).length

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-slate-300">ATS Score</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {hasJobContext
              ? `${passed} of ${total} checks · job-aware score`
              : `${passed} of ${total} profile checks · add job details below`}
          </p>
        </div>
        <div className={`text-3xl font-bold ${scoreColorClass(displayScore)}`}>{displayScore}%</div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all ${
            displayScore >= 80 ? 'bg-emerald-500' : displayScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${displayScore}%` }}
        />
      </div>

      {analysis && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/5 bg-[#0f0f18] px-3 py-2">
            <p className="text-[10px] uppercase text-slate-500">Resume quality</p>
            <p className={`text-lg font-bold ${scoreColorClass(analysis.profileScore)}`}>
              {analysis.profileScore}%
            </p>
          </div>
          <div className="rounded-lg border border-white/5 bg-[#0f0f18] px-3 py-2">
            <p className="text-[10px] uppercase text-slate-500">Job match</p>
            <p className={`text-lg font-bold ${scoreColorClass(analysis.jobMatchScore)}`}>
              {analysis.jobMatchScore}%
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <input
          type="text"
          value={jobTarget.jobTitle}
          onChange={(e) => updateJobTarget({ jobTitle: e.target.value })}
          placeholder="Job profile, e.g. Software Engineer"
          className="w-full rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
        />
        <textarea
          value={jobTarget.jobDescription}
          onChange={(e) => updateJobTarget({ jobDescription: e.target.value })}
          rows={3}
          placeholder="Paste job description for keyword match score..."
          className="w-full resize-y rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
        />
        {!jobDescReady && jobTarget.jobDescription.trim() && (
          <p className="text-xs text-slate-600">Add at least 40 characters for job match scoring.</p>
        )}
      </div>

      {analysis && (
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <User size={12} /> Profile checks
            </h4>
            <CheckList checks={analysis.profileChecks} limit={4} />
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Briefcase size={12} /> Job fit ({analysis.jobTitle})
            </h4>
            <CheckList checks={analysis.jobChecks} limit={4} />
          </div>
        </div>
      )}

      {!analysis && (
        <div className="mt-4 max-h-40 overflow-y-auto">
          <CheckList checks={profileChecks} />
        </div>
      )}
    </div>
  )
}
