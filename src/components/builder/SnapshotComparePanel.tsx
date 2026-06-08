import { useMemo, useState } from 'react'
import { GitCompare } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { ResumeTemplate } from '../templates/ResumeTemplate'

export function SnapshotComparePanel() {
  const { snapshots } = useResume()
  const [leftId, setLeftId] = useState('')
  const [rightId, setRightId] = useState('')

  const left = useMemo(() => snapshots.find((s) => s.id === leftId), [snapshots, leftId])
  const right = useMemo(() => snapshots.find((s) => s.id === rightId), [snapshots, rightId])

  if (snapshots.length < 2) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
        <div className="flex items-center gap-2">
          <GitCompare size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-slate-300">Compare Snapshots</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">Save at least two snapshots to compare side by side.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <GitCompare size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">Compare Snapshots</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <select
          value={leftId}
          onChange={(e) => setLeftId(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300"
        >
          <option value="">Select left…</option>
          {snapshots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={rightId}
          onChange={(e) => setRightId(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300"
        >
          <option value="">Select right…</option>
          {snapshots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      {left && right && (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {[left, right].map((snap) => (
            <div key={snap.id} className="overflow-hidden rounded-lg border border-white/10 bg-white">
              <p className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                {snap.name}
              </p>
              <div className="max-h-64 overflow-auto p-3 text-[8px] leading-tight">
                <ResumeTemplate data={snap.data} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
