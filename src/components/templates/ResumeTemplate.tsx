import type { ResumeData, TemplateId } from '../../types/resume'
import { ModernSidebar, TemplateHeader, TemplateSections } from './TemplateSections'

interface Props {
  data: ResumeData
}

const FONT_CLASS: Partial<Record<TemplateId, string>> = {
  classic: 'font-serif',
  elegant: 'font-serif',
  harvard: 'font-serif',
  executive: 'font-serif',
}

const PADDING_CLASS: Partial<Record<TemplateId, string>> = {
  compact: 'leading-snug',
  elegant: 'leading-relaxed',
}

export function ResumeTemplate({ data }: Props) {
  const template = data.template

  if (template === 'modern') {
    return (
      <div className="flex min-h-full font-sans text-slate-800">
        <ModernSidebar data={data} />
        <main className="flex-1 p-5">
          <TemplateSections data={data} template="modern" excludeSidebar />
        </main>
      </div>
    )
  }

  const fontClass = FONT_CLASS[template] ?? 'font-sans'
  const padClass = PADDING_CLASS[template] ?? ''

  return (
    <div className={`text-slate-800 ${fontClass} ${padClass}`}>
      <TemplateHeader data={data} template={template} />
      <TemplateSections data={data} template={template} />
    </div>
  )
}
