import { useResume } from '../context/ResumeContext'
import { ResumeTemplate } from './templates/ResumeTemplate'
import { getTemplateMeta } from '../templates/registry'

export function PreviewPanel({ dark = false }: { dark?: boolean }) {
  const { resume } = useResume()
  const meta = getTemplateMeta(resume.template)

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>
          Preview
        </h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            dark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-50 text-violet-700'
          }`}
        >
          {meta.name}
        </span>
      </div>

      <div
        className={`flex-1 overflow-auto rounded-2xl border p-3 sm:p-4 ${
          dark ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-100/80'
        }`}
      >
        <div
          id="resume-preview"
          className="mx-auto w-full max-w-[816px] bg-white p-6 shadow-md sm:p-8"
          style={{ minHeight: '480px', aspectRatio: '8.5 / 11' }}
        >
          <ResumeTemplate data={resume} />
        </div>
      </div>
    </div>
  )
}
