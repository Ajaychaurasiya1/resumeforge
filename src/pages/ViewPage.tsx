import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { ResumeTemplate } from '../components/templates/ResumeTemplate'
import { resolveSharedResume } from '../utils/shareStorage'
import { getTemplateMeta } from '../templates/registry'

export function ViewPage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const encoded = params.get('d')

  const resume = useMemo(() => {
    if (!id) return null
    return resolveSharedResume(id, encoded)
  }, [id, encoded])

  if (!resume) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#08080f] px-5 text-center">
        <Sparkles size={32} className="text-violet-500" />
        <h1 className="mt-4 text-xl font-bold text-white">Resume not found</h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          This link may have expired or was opened on a different device without the embedded
          payload. Ask the sender to copy the share link again from ResumeForge.
        </p>
        <Link
          to="/builder"
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Build your own resume
        </Link>
      </div>
    )
  }

  const meta = getTemplateMeta(resume.template)
  const name = resume.personalInfo.fullName || 'Resume'

  return (
    <div className="min-h-screen bg-slate-200 print:bg-white">
      <header className="border-b border-slate-300 bg-white px-5 py-3 print:hidden">
        <div className="mx-auto flex max-w-[816px] items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{name}</p>
              <p className="text-xs text-slate-500">{meta.name} template · read-only</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Print
            </button>
            <Link
              to="/builder"
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Create yours
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[816px] px-4 py-8 print:p-0">
        <div
          id="resume-preview"
          className="bg-white p-6 shadow-lg sm:p-8 print:shadow-none"
          style={{ minHeight: '480px' }}
        >
          <ResumeTemplate data={resume} />
        </div>

        {resume.coverLetter?.body?.trim() && (
          <div className="mt-8 bg-white p-6 shadow-lg sm:p-8 print:mt-0 print:shadow-none print:break-before-page">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Cover Letter</h2>
            {resume.coverLetter.subject && (
              <p className="mb-3 text-sm font-semibold text-slate-800">
                Re: {resume.coverLetter.subject}
              </p>
            )}
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {resume.coverLetter.body}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
