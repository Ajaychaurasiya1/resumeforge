import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Eye,
  EyeOff,
  FileText,
  FolderGit2,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Mail,
  Mic,
  User,
  Users,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import {
  BUILDER_NAV_META,
  CUSTOM_NAV_META,
  getBuilderNavSections,
  type BuilderSection,
} from '../../utils/sectionConfig'

interface Props {
  active: BuilderSection
  onChange: (section: BuilderSection) => void
}

const ICONS: Record<BuilderSection, LucideIcon> = {
  personal: User,
  summary: FileText,
  skills: Zap,
  experience: Briefcase,
  projects: FolderGit2,
  education: GraduationCap,
  certifications: BadgeCheck,
  achievements: Award,
  trainings: BookOpen,
  publications: FileText,
  workshops: Mic,
  references: Users,
  hobbies: Heart,
  languages: Languages,
  custom: Layers,
  coverLetter: Mail,
  preview: Eye,
}

export type { BuilderSection }

export function BuilderNav({ active, onChange }: Props) {
  const { resume } = useResume()
  const sections = getBuilderNavSections(resume)

  return (
    <nav className="flex flex-col gap-0.5 p-1.5 sm:p-2">
      {sections.map((id) => {
        const isActive = active === id
        const isHidden =
          id !== 'personal' && id !== 'preview' && id !== 'custom'
            ? resume.settings.hiddenSections.includes(id)
            : false

        const label =
          id === 'custom' ? CUSTOM_NAV_META.label : BUILDER_NAV_META[id]?.label ?? id
        const Icon = ICONS[id]

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-medium transition sm:gap-3 sm:px-3 sm:text-sm ${
              isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : isHidden
                  ? 'text-slate-600 hover:bg-white/5 hover:text-slate-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Icon size={16} className="shrink-0 sm:h-[18px] sm:w-[18px]" />
            <span className={`leading-tight ${isHidden ? 'line-through opacity-70' : ''}`}>
              {label}
            </span>
            {isHidden && !isActive && <EyeOff size={12} className="ml-auto shrink-0 opacity-50" />}
          </button>
        )
      })}
    </nav>
  )
}
