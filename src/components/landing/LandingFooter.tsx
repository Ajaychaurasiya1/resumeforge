import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#06060c]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <FileText size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">ResumeForge</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              A free, browser-based resume builder that helps you create professional,
              ATS-friendly resumes in minutes. No account required — your data stays on your device.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Platform</p>
            <ul className="mt-4 space-y-2.5">
              {[
                { to: '/features', label: 'Features' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/templates', label: 'Templates' },
                { to: '/builder', label: 'Resume Builder' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 transition hover:text-violet-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/about#mission', label: 'Our Mission' },
                { to: '/about#privacy', label: 'Privacy' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-slate-500 transition hover:text-violet-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8">
          <p className="text-xs text-slate-600">© 2026 ResumeForge. All rights reserved.</p>
          <p className="text-xs text-slate-600">Built for job seekers everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
