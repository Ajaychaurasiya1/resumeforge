import { useState } from 'react'
import { Camera, History, RotateCcw, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'

export function SnapshotPanel() {
  const { snapshots, saveSnapshot, restoreSnapshot, deleteSnapshot } = useResume()
  const [name, setName] = useState('')

  const handleSave = () => {
    saveSnapshot(name.trim() || `Snapshot ${snapshots.length + 1}`)
    setName('')
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <History size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">Resume Snapshots</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Save named versions (e.g. &quot;Google PM&quot;, &quot;Startup Full-stack&quot;) and restore
        later.
      </p>

      <div className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Snapshot name..."
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500"
        >
          <Camera size={14} />
          Save
        </button>
      </div>

      {snapshots.length > 0 ? (
        <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto">
          {snapshots.map((snap) => (
            <li
              key={snap.id}
              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-300">{snap.name}</p>
                <p className="text-[10px] text-slate-600">
                  {new Date(snap.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => restoreSnapshot(snap.id)}
                className="rounded p-1 text-slate-500 hover:bg-violet-500/10 hover:text-violet-400"
                title="Restore snapshot"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => deleteSnapshot(snap.id)}
                className="rounded p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                title="Delete snapshot"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-slate-600">No snapshots yet.</p>
      )}
    </div>
  )
}
