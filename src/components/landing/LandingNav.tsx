import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/templates', label: 'Templates' },
  { to: '/about', label: 'About' },
]

export function LandingNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#08080f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
            <FileText size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">ResumeForge</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                pathname === to
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/builder"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Start Building
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname === to ? 'bg-white/10 text-white' : 'text-slate-400'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/builder"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Start Building
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
