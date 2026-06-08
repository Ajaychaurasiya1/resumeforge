import { FileStack, Plus, Trash2, Briefcase } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'

export function MultiResumePanel() {
  const {
    savedResumes,
    activeResumeId,
    switchResume,
    createNewResumeSlot,
    deleteResumeSlot,
    renameResumeSlot,
    jobTarget,
  } = useResume()

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileStack size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-slate-300">My Resumes</span>
        </div>
        <button
          type="button"
          onClick={() => createNewResumeSlot()}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200"
        >
          <Plus size={12} />
          New
        </button>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Each slot saves its own job title, description, and keywords.
      </p>

      {jobTarget.jobTitle && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-300">
          <Briefcase size={12} />
          Target: {jobTarget.jobTitle}
          {jobTarget.companyName && ` at ${jobTarget.companyName}`}
        </p>
      )}

      <ul className="mt-3 space-y-1.5">
        {savedResumes.map((slot) => (
          <li
            key={slot.id}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
              slot.id === activeResumeId
                ? 'border-violet-500/40 bg-violet-500/10'
                : 'border-white/5 bg-white/[0.02]'
            }`}
          >
            <button
              type="button"
              onClick={() => switchResume(slot.id)}
              className="min-w-0 flex-1 truncate text-left text-sm text-slate-300"
            >
              {slot.name}
            </button>
            <input
              type="text"
              defaultValue={slot.name}
              onBlur={(e) => {
                const name = e.target.value.trim()
                if (name && name !== slot.name) renameResumeSlot(slot.id, name)
              }}
              className="hidden w-24 rounded border border-white/10 bg-[#0f0f18] px-1.5 py-0.5 text-xs text-slate-400 sm:block"
              title="Rename on blur"
            />
            {savedResumes.length > 1 && (
              <button
                type="button"
                onClick={() => deleteResumeSlot(slot.id)}
                className="rounded p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                title="Delete resume"
              >
                <Trash2 size={12} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
