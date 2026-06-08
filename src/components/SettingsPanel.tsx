import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Palette, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { useResume } from '../context/ResumeContext'
import { type FontFamily, type FontSize, type LineSpacing } from '../types/resume'
import { getSectionLabel } from '../utils/sectionConfig'
import { ACCENT_SWATCHES } from '../utils/theme'
import { SectionCard } from './SectionCard'

export function SettingsPanel({ dark = false }: { dark?: boolean }) {
  const { resume, updateSettings, toggleSectionVisibility, moveSection, reorderSection } =
    useResume()
  const { settings } = resume
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const labelCls = dark ? 'text-slate-400' : 'text-slate-600'
  const rowCls = dark ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/50'
  const rowTextCls = dark ? 'text-slate-300' : 'text-slate-700'
  const sizeBtnActive = dark
    ? 'border-violet-500 bg-violet-500/20 text-violet-300'
    : 'border-violet-400 bg-violet-50 text-violet-700'
  const sizeBtnIdle = dark
    ? 'border-white/10 text-slate-400 hover:bg-white/5'
    : 'border-slate-200 text-slate-600 hover:bg-slate-50'

  const handleDrop = (toIndex: number) => {
    if (dragIndex === null || dragIndex === toIndex) return
    reorderSection(dragIndex, toIndex)
    setDragIndex(null)
  }

  return (
    <SectionCard title="Customize" icon={<Settings2 size={16} />} defaultOpen={false} dark={dark}>
      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Palette size={14} className={dark ? 'text-slate-500' : 'text-slate-500'} />
            <span className={`text-xs font-medium ${labelCls}`}>Accent Color</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCENT_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                title={swatch.label}
                onClick={() => updateSettings({ accentColor: swatch.id })}
                className={`h-8 w-8 rounded-full border-2 transition hover:scale-110 ${
                  settings.accentColor === swatch.id
                    ? dark
                      ? 'border-white ring-2 ring-violet-500 ring-offset-2 ring-offset-[#1a1a27]'
                      : 'border-slate-800 ring-2 ring-offset-2 ring-slate-300'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: swatch.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <span className={`mb-2 block text-xs font-medium ${labelCls}`}>Font Size</span>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateSettings({ fontSize: size })}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition ${
                  settings.fontSize === size ? sizeBtnActive : sizeBtnIdle
                }`}
              >
                {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={`mb-2 block text-xs font-medium ${labelCls}`}>Font Family</span>
          <select
            value={settings.fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value as FontFamily })}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500 ${
              dark
                ? 'border-white/10 bg-[#0f0f18] text-slate-300'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <option value="sans">Sans-serif (System)</option>
            <option value="serif">Serif (Merriweather)</option>
            <option value="arial">Arial</option>
            <option value="calibri">Calibri</option>
            <option value="georgia">Georgia</option>
          </select>
        </div>

        <div>
          <span className={`mb-2 block text-xs font-medium ${labelCls}`}>Line Spacing</span>
          <div className="flex gap-2">
            {(
              [
                { id: 'tight', label: 'Tight' },
                { id: 'normal', label: 'Normal' },
                { id: 'relaxed', label: 'Relaxed' },
              ] as { id: LineSpacing; label: string }[]
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => updateSettings({ lineSpacing: id })}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                  settings.lineSpacing === id ? sizeBtnActive : sizeBtnIdle
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={`mb-2 block text-xs font-medium ${labelCls}`}>
            Section Order & Visibility
          </span>
          <p className={`mb-2 text-xs ${labelCls}`}>
            Drag to reorder, or use arrows. Hide sections you don&apos;t need.
          </p>
          <div className="space-y-1">
            {settings.sectionOrder.map((id, index) => {
              const isHidden = settings.hiddenSections.includes(id)
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => setDragIndex(null)}
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${rowCls} ${
                    dragIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <GripVertical size={14} className="shrink-0 cursor-grab text-slate-600" />
                  <span
                    className={`flex-1 text-sm ${isHidden ? 'text-slate-600 line-through' : rowTextCls}`}
                  >
                    {getSectionLabel(id, resume)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSection(id, 'up')}
                      className={`rounded p-1 disabled:opacity-30 ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === settings.sectionOrder.length - 1}
                      onClick={() => moveSection(id, 'down')}
                      className={`rounded p-1 disabled:opacity-30 ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(id)}
                      className={`rounded p-1 ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                      title={isHidden ? 'Show section' : 'Hide section'}
                    >
                      {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
