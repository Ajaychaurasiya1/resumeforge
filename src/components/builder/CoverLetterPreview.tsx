import type { CoverLetterData, TemplateId } from '../../types/resume'
import { getTemplateMeta } from '../../templates/registry'
import { ACCENT_MAP } from '../../utils/theme'

interface Props {
  letter: CoverLetterData
  template: TemplateId
  senderName: string
}

const HEADER_STYLES: Partial<Record<TemplateId, string>> = {
  corporate: 'bg-slate-800 text-white px-4 py-3 rounded-t-lg',
  bold: 'bg-indigo-600 text-white px-4 py-4 rounded-t-lg',
  startup: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3 rounded-t-lg',
  legal: 'border-y border-slate-800 py-3 text-center font-serif',
  elegant: 'text-center font-serif border-b border-slate-200 pb-3',
  europass: 'border-b-2 border-blue-700 text-blue-900 pb-2',
  technical: 'bg-indigo-600 text-white px-3 py-2 rounded',
  executive: 'border-t-2 border-b-2 border-slate-800 py-2 text-center uppercase tracking-widest',
}

export function CoverLetterPreview({ letter, template, senderName }: Props) {
  const meta = getTemplateMeta(template)
  const accent = ACCENT_MAP.indigo
  const headerClass = HEADER_STYLES[template] ?? 'border-b border-slate-200 pb-2'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-800 shadow-sm">
      <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">
        Cover letter · {meta.name} style
      </p>
      <header className={headerClass}>
        <h3 className="text-lg font-bold">{senderName || 'Your Name'}</h3>
      </header>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
        {letter.date && <p className="text-slate-500">{letter.date}</p>}
        {(letter.recipientName || letter.companyName) && (
          <p>
            {[letter.recipientName, letter.recipientTitle, letter.companyName]
              .filter(Boolean)
              .join('\n')
              .split('\n')
              .map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
          </p>
        )}
        {letter.subject && (
          <p className={`font-semibold ${accent.text}`}>Re: {letter.subject}</p>
        )}
        {letter.body ? (
          letter.body.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)
        ) : (
          <p className="italic text-slate-400">Your cover letter body will appear here.</p>
        )}
        {senderName && <p className="font-medium">{senderName}</p>}
      </div>
    </div>
  )
}
