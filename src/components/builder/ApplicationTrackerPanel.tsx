import { useState } from 'react'
import { ClipboardList, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import {
  APPLICATION_STATUS_LABELS,
  addApplication,
  deleteApplication,
  loadApplications,
  saveApplications,
  type ApplicationStatus,
  type JobApplication,
} from '../../utils/applicationStorage'

export function ApplicationTrackerPanel() {
  const { activeResumeId, savedResumes, jobTarget, snapshots } = useResume()
  const [apps, setApps] = useState<JobApplication[]>(() => loadApplications())
  const [company, setCompany] = useState(jobTarget.companyName)
  const [role, setRole] = useState(jobTarget.jobTitle)

  const refresh = () => setApps(loadApplications())

  const handleAdd = () => {
    if (!company.trim() || !role.trim()) return
    const slot = savedResumes.find((s) => s.id === activeResumeId)
    addApplication({
      company: company.trim(),
      role: role.trim(),
      jobTitle: jobTarget.jobTitle,
      dateApplied: new Date().toISOString().slice(0, 10),
      status: 'applied',
      resumeSlotId: activeResumeId,
      resumeSlotName: slot?.name,
      notes: jobTarget.jobDescription.slice(0, 200),
    })
    setCompany('')
    refresh()
  }

  const updateStatus = (id: string, status: ApplicationStatus) => {
    const next = apps.map((a) => (a.id === id ? { ...a, status } : a))
    saveApplications(next)
    refresh()
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <ClipboardList size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">Application Tracker</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">Track applications locally in your browser.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
        {apps.length === 0 ? (
          <li className="text-sm text-slate-500">No applications tracked yet.</li>
        ) : (
          apps.map((app) => (
            <li
              key={app.id}
              className="flex items-start justify-between gap-2 rounded-lg border border-white/5 bg-[#0f0f18] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-300">{app.company}</p>
                <p className="truncate text-xs text-slate-500">{app.role}</p>
                <p className="text-[10px] text-slate-600">
                  {app.dateApplied}
                  {app.resumeSlotName && ` · ${app.resumeSlotName}`}
                  {snapshots.length > 0 && ` · ${snapshots.length} snapshot(s)`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                  className="rounded border border-white/10 bg-[#1a1a27] px-1.5 py-1 text-[10px] text-slate-400"
                >
                  {(Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {APPLICATION_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    deleteApplication(app.id)
                    refresh()
                  }}
                  className="rounded p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
