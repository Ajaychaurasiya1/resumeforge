import { useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { ResumeTemplate } from '../templates/ResumeTemplate'
import type { TemplateId } from '../../types/resume'
import {
  getTemplatePreviewData,
  PREVIEW_PAGE_WIDTH,
} from '../../utils/templatePreviewData'

interface Props {
  templateId: TemplateId
  selected?: boolean
  showCheck?: boolean
}

export function TemplatePreviewCard({ templateId, selected, showCheck = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.2)
  const previewData = useMemo(() => getTemplatePreviewData(templateId), [templateId])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateScale = () => {
      const width = el.clientWidth
      if (width > 0) setScale(width / PREVIEW_PAGE_WIDTH)
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg border bg-white shadow-sm ${
        selected ? 'border-violet-500 ring-2 ring-violet-500/40' : 'border-slate-200'
      }`}
      style={{ aspectRatio: '8.5 / 11' }}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 bg-white"
        style={{
          width: PREVIEW_PAGE_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div className="p-6 sm:p-8">
          <ResumeTemplate data={previewData} />
        </div>
      </div>
      {showCheck && selected && (
        <div className="absolute right-1 top-1 z-10 rounded-full bg-violet-600 p-0.5 text-white shadow">
          <Check size={10} />
        </div>
      )}
    </div>
  )
}
