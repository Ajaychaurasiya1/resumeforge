import { Briefcase } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { applyIndustryPack, INDUSTRY_PACKS, type IndustryPackId } from '../../utils/industryPacks'

export function IndustryPackPanel() {
  const { setResume } = useResume()

  const apply = (id: IndustryPackId) => {
    setResume((prev) => applyIndustryPack(prev, id))
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <Briefcase size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">Industry Packs</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        One-click add role-specific skills and sample bullets (merged with your existing content).
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {INDUSTRY_PACKS.map((pack) => (
          <button
            key={pack.id}
            type="button"
            onClick={() => apply(pack.id)}
            className="rounded-lg border border-white/10 bg-[#0f0f18] p-3 text-left transition hover:border-violet-500/40 hover:bg-violet-500/5"
          >
            <p className="text-sm font-medium text-slate-200">{pack.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{pack.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
