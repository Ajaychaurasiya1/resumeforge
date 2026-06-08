import type { ResumeData } from '../../types/resume'
import type { HeaderVariant } from '../../templates/themes'
import { FONT_SIZE_MAP, ACCENT_MAP } from '../../utils/theme'
import { getPersonalContactItems, getPersonalSubtitle } from '../../utils/personalInfo'
import { LabeledContactLine } from './ResumeLinks'

interface Props {
  data: ResumeData
  variant: HeaderVariant
}

export function TemplateHeader({ data, variant }: Props) {
  const { personalInfo } = data
  const { name, body } = FONT_SIZE_MAP[data.settings.fontSize]
  const accent = ACCENT_MAP[data.settings.accentColor]

  const contactItems = getPersonalContactItems(personalInfo)
  const subtitle = getPersonalSubtitle(personalInfo)
  const displayName = personalInfo.fullName || 'Your Name'

  const linkDefault =
    'underline decoration-slate-300/70 underline-offset-2 hover:decoration-current'
  const linkLight =
    'underline decoration-white/40 underline-offset-2 hover:decoration-white'

  const contact = (className: string, linkClassName = linkDefault, separator = ' · ') =>
    contactItems.length > 0 ? (
      <LabeledContactLine
        items={contactItems}
        className={className}
        linkClassName={linkClassName}
        separator={separator}
      />
    ) : null

  const roleLine = (className: string) =>
    subtitle ? <p className={className}>{subtitle}</p> : null

  const photoEl = personalInfo.photoUrl ? (
    <img
      src={personalInfo.photoUrl}
      alt=""
      className="h-20 w-20 shrink-0 rounded object-cover ring-2 ring-slate-200"
    />
  ) : null

  switch (variant) {
    case 'classic-centered':
      return (
        <header className="border-b-2 border-slate-800 pb-3 text-center">
          <h1 className={`font-bold tracking-wide ${name}`}>{displayName}</h1>
          {roleLine(`mt-0.5 font-medium text-slate-700 ${body}`)}
          {contact(`mt-1 text-slate-600 ${body}`)}
        </header>
      )

    case 'minimal-bar':
      return (
        <header className="mb-6">
          <h1 className={`font-bold tracking-tight ${name}`}>{displayName}</h1>
          {roleLine(`mt-1 text-slate-600 ${body}`)}
          {contact(`mt-2 text-slate-500 ${body}`, linkDefault, '  ·  ')}
          <div className={`mt-4 h-0.5 w-12 ${accent.bg}`} />
        </header>
      )

    case 'professional-photo':
      return (
        <header className={`mb-5 border-b-2 ${accent.border} pb-4`}>
          <div className="flex items-start gap-4">
            {photoEl}
            <div>
              <h1 className={`font-bold ${name} text-slate-900`}>{displayName}</h1>
              {roleLine(`mt-1 text-slate-700 ${body}`)}
              {contact(`mt-2 text-slate-600 ${body}`)}
            </div>
          </div>
        </header>
      )

    case 'executive-rules':
      return (
        <header className="mb-6 text-center">
          <div className="mb-3 border-t-2 border-b-2 border-slate-800 py-3">
            <h1 className={`font-bold uppercase tracking-[0.15em] ${name}`}>{displayName}</h1>
          </div>
          {roleLine(`font-medium text-slate-700 ${body}`)}
          {contact(`text-slate-600 ${body}`)}
        </header>
      )

    case 'compact-line':
      return (
        <header className="mb-4 border-b border-slate-400 pb-2">
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {roleLine(`mt-0.5 text-slate-700 ${body}`)}
          {contact(`mt-0.5 text-slate-600 ${body}`)}
        </header>
      )

    case 'harvard-plain':
      return (
        <header className="mb-5">
          <h1 className={`font-bold ${name} text-slate-900`}>{displayName}</h1>
          {roleLine(`mt-0.5 text-slate-700 ${body}`)}
          {contact(`mt-1 text-slate-600 ${body}`)}
        </header>
      )

    case 'chrono-border':
      return (
        <header className={`mb-5 border-b ${accent.border} pb-3`}>
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {roleLine(`mt-0.5 text-slate-600 ${body}`)}
          {contact(`mt-1 text-slate-500 ${body}`)}
        </header>
      )

    case 'technical-band':
      return (
        <header className={`mb-5 ${accent.bg} -mx-2 rounded px-4 py-4 text-white sm:-mx-0`}>
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {roleLine(`mt-0.5 text-white/90 ${body}`)}
          {contact(`mt-1 text-white/80 ${body}`, linkLight)}
        </header>
      )

    case 'elegant-serif':
      return (
        <header className="mb-8 text-center">
          {photoEl && <div className="mb-3 flex justify-center">{photoEl}</div>}
          <h1 className={`font-serif font-light tracking-wide ${name} text-slate-800`}>{displayName}</h1>
          <div className="mx-auto mt-3 h-px w-24 bg-slate-300" />
          {roleLine(`mt-2 text-slate-600 ${body}`)}
          {contact(`mt-3 text-slate-500 ${body}`)}
        </header>
      )

    case 'europass-blue':
      return (
        <header className="mb-5 border-b-2 border-blue-700 pb-4">
          <div className="flex items-start gap-4">
            {photoEl}
            <div>
              <h1 className={`font-bold uppercase tracking-wide text-blue-900 ${name}`}>{displayName}</h1>
              {roleLine(`mt-1 text-blue-800 ${body}`)}
              {contact(`mt-2 text-slate-600 ${body}`)}
            </div>
          </div>
        </header>
      )

    case 'academic-photo':
      return (
        <header className="mb-5 border-b border-slate-400 pb-3">
          <div className="flex items-start gap-4">
            {photoEl}
            <div>
              <h1 className={`font-serif font-bold ${name} text-slate-900`}>{displayName}</h1>
              {roleLine(`mt-0.5 text-slate-700 ${body}`)}
              {contact(`mt-1 text-slate-600 ${body}`)}
            </div>
          </div>
        </header>
      )

    case 'bold-hero':
      return (
        <header className={`mb-6 rounded-lg ${accent.bg} px-6 py-8 text-white`}>
          <h1 className={`font-black uppercase tracking-tight ${name}`}>{displayName}</h1>
          {roleLine(`mt-2 text-lg text-white/90 ${body}`)}
          {contact(`mt-3 text-white/80 ${body}`, linkLight, '  |  ')}
        </header>
      )

    case 'corporate-band':
      return (
        <header className="mb-5 bg-slate-800 px-5 py-5 text-white">
          <h1 className={`font-semibold tracking-wide ${name}`}>{displayName}</h1>
          {roleLine(`mt-1 text-slate-300 ${body}`)}
          {contact(`mt-2 text-slate-400 ${body}`, linkLight)}
        </header>
      )

    case 'startup-gradient': {
      const gradientFrom: Record<string, string> = {
        indigo: 'from-indigo-600',
        blue: 'from-blue-600',
        emerald: 'from-emerald-600',
        rose: 'from-rose-600',
        slate: 'from-slate-700',
      }
      const from = gradientFrom[data.settings.accentColor] ?? 'from-indigo-600'
      return (
        <header className={`mb-5 rounded-lg bg-gradient-to-r ${from} to-violet-600 px-5 py-5 text-white`}>
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {roleLine(`mt-1 text-white/90 ${body}`)}
          {contact(`mt-2 text-white/75 ${body}`, linkLight)}
        </header>
      )
    }

    case 'creative-offset':
      return (
        <header className="relative mb-8 pl-4">
          <div className={`absolute bottom-0 left-0 top-0 w-1.5 rounded-full ${accent.bg}`} />
          <div className={`absolute -left-1 top-0 h-16 w-16 rounded-br-3xl opacity-20 ${accent.bg}`} />
          <h1 className={`relative font-bold ${name} text-slate-900`}>{displayName}</h1>
          {roleLine(`relative mt-1 ${accent.text} ${body}`)}
          {contact(`relative mt-3 text-slate-600 ${body}`)}
        </header>
      )

    case 'legal-formal':
      return (
        <header className="mb-6 text-center">
          <div className="border-t border-b border-slate-800 py-4">
            <h1 className={`font-serif font-bold uppercase tracking-[0.2em] ${name}`}>{displayName}</h1>
            {roleLine(`mt-2 font-serif italic text-slate-700 ${body}`)}
          </div>
          {contact(`mt-3 text-slate-600 ${body}`, linkDefault, '   ·   ')}
        </header>
      )

    case 'metro-inline':
      return (
        <header className={`mb-5 border-b-2 ${accent.border} pb-4`}>
          <h1 className={`font-bold ${name} text-slate-900`}>{displayName}</h1>
          {roleLine(`mt-1 ${accent.text} ${body}`)}
        </header>
      )

    case 'split-header':
      return (
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <h1 className={`font-bold ${name} text-slate-900`}>{displayName}</h1>
            {roleLine(`mt-0.5 text-slate-600 ${body}`)}
          </div>
          <div className="text-right">{contact(`text-slate-600 ${body}`, linkDefault, '\n')}</div>
        </header>
      )

    case 'timeline-minimal':
      return (
        <header className="mb-6">
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {roleLine(`mt-1 ${accent.text} font-medium ${body}`)}
          {contact(`mt-2 text-slate-500 ${body}`)}
          <div className={`mt-4 h-1 w-full max-w-xs rounded-full ${accent.bg}`} />
        </header>
      )

    default:
      return (
        <header className="mb-5">
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {roleLine(`mt-0.5 text-slate-700 ${body}`)}
          {contact(`mt-1 text-slate-600 ${body}`)}
        </header>
      )
  }
}
