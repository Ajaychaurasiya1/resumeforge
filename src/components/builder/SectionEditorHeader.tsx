import { Eye, EyeOff } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { type BuilderSection } from '../../utils/sectionConfig'

interface Props {
  section: BuilderSection
  title: string
  description: string
  light?: boolean
}

export function SectionEditorHeader({ section, title, description, light = false }: Props) {
  const { resume, toggleSectionVisibility } = useResume()

  const sectionId =
    section === 'personal' || section === 'preview' || section === 'custom' ? null : section

  const isHidden = sectionId ? resume.settings.hiddenSections.includes(sectionId) : false

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className={`text-xl font-bold ${light ? 'text-slate-900' : 'text-white'}`}>{title}</h2>
        <p className={`mt-1 text-sm ${light ? 'text-slate-500' : 'text-slate-500'}`}>{description}</p>
        {isHidden && (
          <p className={`mt-2 text-xs ${light ? 'text-amber-600' : 'text-amber-400/90'}`}>
            Hidden from resume — click Show to include it.
          </p>
        )}
      </div>
      {sectionId && (
        <button
          type="button"
          onClick={() => toggleSectionVisibility(sectionId)}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            isHidden
              ? light
                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/15'
              : light
                ? 'border-slate-200 text-slate-500 hover:bg-slate-50'
                : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
          {isHidden ? 'Show' : 'Hide'}
        </button>
      )}
    </div>
  )
}
