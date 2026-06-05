import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function CtaBanner() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 p-10 text-center sm:p-14">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Ready to build your resume?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Jump into the editor and create a polished, professional resume in under 15 minutes.
          Completely free, no sign-up needed.
        </p>
        <Link
          to="/builder"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Open Resume Builder
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
