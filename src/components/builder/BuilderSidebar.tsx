import { Check, EyeOff, X } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { BUILDER_STEPS, isSectionComplete } from '../../utils/builderSteps'
import type { BuilderSection } from '../../utils/sectionConfig'

interface Props {
  active: BuilderSection
  onChange: (section: BuilderSection) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function BuilderSidebar({ active, onChange, mobileOpen, onMobileClose }: Props) {
  const { resume } = useResume()

  const handleSelect = (id: BuilderSection) => {
    onChange(id)
    onMobileClose?.()
  }

  const nav = (
    <nav className="flex flex-col gap-0.5 p-2">
      {BUILDER_STEPS.map(({ id, emoji, label }) => {
        const isActive = active === id
        const isHidden = id !== 'preview' && resume.settings.hiddenSections.includes(id)
        const complete = id !== 'preview' && isSectionComplete(id, resume)

        return (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm font-medium transition sm:gap-3 sm:px-3 ${
              isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : isHidden
                  ? 'text-slate-600 hover:bg-white/5 hover:text-slate-500'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <span className="shrink-0 text-base leading-none">{emoji}</span>
            <span
              className={`leading-tight ${isHidden && !isActive ? 'line-through opacity-70' : ''}`}
            >
              {label}
            </span>
            {complete && !isActive && (
              <Check size={14} className="ml-auto shrink-0 text-emerald-500" />
            )}
            {isHidden && !isActive && (
              <EyeOff size={12} className={`shrink-0 opacity-40 ${complete ? '' : 'ml-auto'}`} />
            )}
          </button>
        )
      })}
    </nav>
  )

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`builder-scrollbar fixed inset-y-0 left-0 z-50 h-full w-64 shrink-0 overflow-y-auto overscroll-contain border-r border-white/5 bg-[#0a0a12] transition-transform lg:static lg:z-auto lg:w-44 lg:translate-x-0 xl:w-56 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-3 lg:hidden">
          <span className="text-sm font-semibold text-white">Sections</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>
        {nav}
      </aside>
    </>
  )
}
