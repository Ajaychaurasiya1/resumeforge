import type { SectionHeadingVariant } from '../../templates/themes'

export function SectionHeading({
  title,
  variant,
  accent,
  accentBorder,
  accentBg,
  fontSection,
  index,
}: {
  title: string
  variant: SectionHeadingVariant
  accent: string
  accentBorder: string
  accentBg: string
  fontSection: string
  index?: number
}) {
  switch (variant) {
    case 'border-bottom':
      return (
        <h2 className={`mb-2 border-b border-slate-300 font-bold uppercase tracking-wider ${fontSection}`}>
          {title}
        </h2>
      )
    case 'border-left':
      return (
        <h2 className={`mb-2 border-l-4 ${accentBorder} pl-3 font-bold uppercase tracking-wide ${fontSection}`}>
          {title}
        </h2>
      )
    case 'center-flanked':
      return (
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-300" />
          <h2 className={`font-bold uppercase tracking-[0.2em] ${fontSection}`}>{title}</h2>
          <div className="h-px flex-1 bg-slate-300" />
        </div>
      )
    case 'compact':
      return (
        <h2 className={`mb-1 font-bold uppercase ${fontSection} text-slate-800`}>{title}</h2>
      )
    case 'harvard-caps':
      return (
        <h2 className={`mb-2 font-semibold uppercase tracking-[0.15em] text-slate-700 ${fontSection}`}>
          {title}
        </h2>
      )
    case 'pill-badge':
      return (
        <h2
          className={`mb-2 inline-block rounded px-2 py-0.5 font-bold uppercase tracking-wide text-white ${accentBg} ${fontSection}`}
        >
          {title}
        </h2>
      )
    case 'serif-italic':
      return (
        <h2 className={`mb-3 border-b border-slate-200 pb-1 font-serif italic ${fontSection} text-slate-700`}>
          {title}
        </h2>
      )
    case 'accent-track':
      return (
        <h2 className={`mb-2 font-semibold uppercase tracking-widest ${fontSection} ${accent}`}>{title}</h2>
      )
    case 'accent-bold':
      return (
        <h2 className={`mb-3 font-bold uppercase tracking-wider ${fontSection} ${accent}`}>{title}</h2>
      )
    case 'blue-box':
      return (
        <h2 className={`mb-2 inline-block rounded-sm bg-blue-700 px-2 py-0.5 font-bold uppercase tracking-wide text-white ${fontSection}`}>
          {title}
        </h2>
      )
    case 'underline-accent':
      return (
        <h2 className={`mb-2 border-b-2 ${accentBorder} pb-1 font-bold uppercase tracking-wide ${fontSection}`}>
          {title}
        </h2>
      )
    case 'ribbon':
      return (
        <div className="mb-3 flex items-stretch">
          <span className={`flex items-center px-3 py-1 font-bold uppercase tracking-wide text-white ${accentBg} ${fontSection}`}>
            {title}
          </span>
          <span className={`flex-1 border-b-2 ${accentBorder}`} />
        </div>
      )
    case 'reverse-fill':
      return (
        <h2
          className={`mb-3 inline-block rounded-r-full ${accentBg} px-4 py-1 font-bold uppercase tracking-wider text-white ${fontSection}`}
        >
          {title}
        </h2>
      )
    case 'dotted':
      return (
        <h2 className={`mb-2 border-b border-dotted border-slate-400 pb-1 font-semibold uppercase tracking-wide ${fontSection} ${accent}`}>
          {title}
        </h2>
      )
    case 'double-line':
      return (
        <div className="mb-3">
          <h2 className={`font-bold uppercase tracking-wider ${fontSection} text-slate-800`}>{title}</h2>
          <div className="mt-1 h-0.5 w-full bg-slate-300" />
        </div>
      )
    case 'circle-dot':
      return (
        <div className="mb-3 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${accentBg}`} />
          <h2 className={`font-bold uppercase tracking-wide ${fontSection}`}>{title}</h2>
        </div>
      )
    case 'gradient-text':
      return (
        <h2
          className={`mb-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text font-bold uppercase tracking-wide text-transparent ${fontSection}`}
        >
          {title}
        </h2>
      )
    case 'numbered':
      return (
        <div className="mb-2 flex items-baseline gap-2">
          <span className={`font-bold tabular-nums ${accent}`}>{String((index ?? 0) + 1).padStart(2, '0')}</span>
          <h2 className={`font-bold uppercase tracking-wide ${fontSection} text-slate-800`}>{title}</h2>
        </div>
      )
    case 'legal-rule':
      return (
        <div className="mb-3 border-y border-slate-400 py-1">
          <h2 className={`text-center font-bold uppercase tracking-[0.25em] ${fontSection} text-slate-800`}>
            {title}
          </h2>
        </div>
      )
    default:
      return (
        <h2 className={`mb-3 font-bold uppercase tracking-wider ${fontSection} ${accent}`}>{title}</h2>
      )
  }
}
