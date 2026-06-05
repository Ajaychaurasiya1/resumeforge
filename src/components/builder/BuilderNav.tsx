import {
  User,
  Zap,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  BadgeCheck,
  Eye,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type BuilderSection =
  | 'personal'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'achievements'
  | 'certifications'
  | 'preview'

export const BUILDER_SECTIONS: {
  id: BuilderSection
  label: string
  icon: LucideIcon
}[] = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'certifications', label: 'Certifications', icon: BadgeCheck },
  { id: 'preview', label: 'Preview & Download', icon: Eye },
]

interface Props {
  active: BuilderSection
  onChange: (section: BuilderSection) => void
}

export function BuilderNav({ active, onChange }: Props) {
  return (
    <nav className="flex flex-col gap-0.5 p-1.5 sm:p-2">
      {BUILDER_SECTIONS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-medium transition sm:gap-3 sm:px-3 sm:text-sm ${
              isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Icon size={16} className="shrink-0 sm:h-[18px] sm:w-[18px]" />
            <span className="leading-tight">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
