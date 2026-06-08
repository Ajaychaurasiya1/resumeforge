import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, Menu, X } from 'lucide-react'
import { BUILDER_LINK, COMPANY_LINKS, HEADER_LINKS, isNavActive, PLATFORM_LINKS } from '../../config/siteNav'

function navLinkClass(active: boolean) {
  return active
    ? 'bg-white/10 text-white'
    : 'text-slate-400 hover:bg-white/5 hover:text-white'
}

export function LandingNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#08080f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMenu}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
            <FileText size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">ResumeForge</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {HEADER_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${navLinkClass(isNavActive(pathname, to))}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link
            to={BUILDER_LINK.to}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            {BUILDER_LINK.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 px-5 py-4 lg:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">Platform</p>
          <nav className="flex flex-col gap-1">
            {PLATFORM_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${navLinkClass(isNavActive(pathname, to))}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-slate-600">Company</p>
          <nav className="flex flex-col gap-1">
            {COMPANY_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${navLinkClass(isNavActive(pathname, to))}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
