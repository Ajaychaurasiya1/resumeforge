import type { CSSProperties } from 'react'
import type { ResumeData } from '../../types/resume'
import { TemplateHeader } from './TemplateHeader'
import { TemplateSections } from './TemplateSections'
import { TemplateSidebar } from './TemplateSections'
import { getTemplateTheme } from '../../templates/themes'
import { FONT_FAMILY_MAP, LINE_SPACING_MAP } from '../../utils/theme'

interface Props {
  data: ResumeData
}

const GAP_CLASS = {
  tight: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
} as const

export function ResumeTemplate({ data }: Props) {
  const template = data.template
  const theme = getTemplateTheme(template)
  const fontFamily = FONT_FAMILY_MAP[data.settings.fontFamily]
  const lineSpacing = LINE_SPACING_MAP[data.settings.lineSpacing]
  const templateFont = theme.forceSerif ? 'font-serif' : fontFamily.className
  const padClass = GAP_CLASS[theme.sectionGap] ?? lineSpacing
  const style = { fontFamily: fontFamily.css } as CSSProperties

  if (theme.layout === 'sidebar-left') {
    return (
      <div className={`flex min-h-full text-slate-800 ${fontFamily.className} ${lineSpacing}`} style={style}>
        <TemplateSidebar data={data} template={template} position="left" />
        <main className="order-2 flex-1 p-5">
          <TemplateSections data={data} template={template} excludeSidebar />
        </main>
      </div>
    )
  }

  if (theme.layout === 'sidebar-right') {
    return (
      <div className={`flex min-h-full text-slate-800 ${fontFamily.className} ${lineSpacing}`} style={style}>
        <main className="order-1 flex-1 p-5">
          <TemplateHeader data={data} variant={theme.header} />
          <TemplateSections data={data} template={template} excludeSidebar />
        </main>
        <TemplateSidebar data={data} template={template} position="right" />
      </div>
    )
  }

  if (theme.layout === 'split-content') {
    return (
      <div className={`text-slate-800 ${templateFont} ${padClass}`} style={style}>
        <TemplateHeader data={data} variant={theme.header} />
        <div className="flex gap-6">
          <div className="min-w-0 flex-1">
            <TemplateSections data={data} template={template} column="left" />
          </div>
          <div className="w-[38%] shrink-0 border-l border-dotted border-slate-300 pl-5">
            <TemplateSections data={data} template={template} column="right" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`text-slate-800 ${templateFont} ${padClass}`} style={style}>
      <TemplateHeader data={data} variant={theme.header} />
      <TemplateSections data={data} template={template} />
    </div>
  )
}
