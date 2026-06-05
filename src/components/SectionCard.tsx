import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface SectionCardProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  dark?: boolean
}

export function SectionCard({ title, icon, children, defaultOpen = true, dark = false }: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section
      className={`overflow-hidden rounded-xl border shadow-sm ${
        dark ? 'border-white/5 bg-[#1a1a27]' : 'border-slate-200 bg-white'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between px-4 py-3 text-left transition ${
          dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-violet-500">{icon}</span>}
          <h2 className={`text-sm font-semibold ${dark ? 'text-slate-200' : 'text-slate-800'}`}>
            {title}
          </h2>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${dark ? 'text-slate-500' : 'text-slate-400'} ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className={`border-t px-4 py-4 ${dark ? 'border-white/5' : 'border-slate-100'}`}>
          {children}
        </div>
      )}
    </section>
  )
}
