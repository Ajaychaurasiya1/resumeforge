import { useMemo, useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import {
  TEMPLATE_FILTER_OPTIONS,
  TEMPLATE_REGISTRY,
  filterTemplates,
} from '../../templates/registry'
import type { TemplateCategory, TemplateId } from '../../types/resume'
import { getRecommendedTemplateMeta } from '../../utils/templateRecommendations'
import { getTemplateAccentPreset } from '../../utils/templateAccentPresets'
import { TemplatePreviewCard } from './TemplatePreviewCard'

interface Props {
  value: TemplateId
  onChange: (id: TemplateId) => void
  onAccentPreset?: (accent: NonNullable<ReturnType<typeof getTemplateAccentPreset>>) => void
  role?: string
  compact?: boolean
}

export function TemplatePicker({ value, onChange, onAccentPreset, role = '', compact = false }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all')

  const recommended = useMemo(() => getRecommendedTemplateMeta(role), [role])

  const templates = useMemo(() => {
    let list = filterTemplates(category)
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.bestFor.some((b) => b.toLowerCase().includes(q)),
    )
  }, [category, query])

  const pick = (id: TemplateId) => {
    onChange(id)
    const preset = getTemplateAccentPreset(id)
    if (preset && onAccentPreset) onAccentPreset(preset)
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {!compact && (
        <p className="text-xs text-slate-500">
          Click a layout to apply it — your content stays the same.
        </p>
      )}

      {!compact && role.trim() && recommended.length > 0 && (
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
            <Sparkles size={12} />
            Recommended for {role}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recommended.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pick(t.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  value === t.id
                    ? 'bg-violet-600 text-white'
                    : 'border border-violet-500/30 text-violet-300 hover:bg-violet-500/20'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border border-white/10 bg-[#0f0f18] py-2 pl-9 pr-3 text-sm text-slate-300 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TEMPLATE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setCategory(opt.id)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${
              category === opt.id
                ? 'bg-violet-600 text-white'
                : 'border border-white/10 text-slate-500 hover:text-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {templates.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">No templates match your search.</p>
      ) : (
        <div
          className={`grid gap-3 ${compact ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}
        >
          {templates.map((template) => {
            const selected = value === template.id
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => pick(template.id)}
                className={`group text-left transition ${selected ? '' : 'opacity-90 hover:opacity-100'}`}
              >
                <TemplatePreviewCard templateId={template.id} selected={selected} />
                <p
                  className={`mt-1.5 truncate text-xs font-medium ${selected ? 'text-violet-300' : 'text-slate-400 group-hover:text-slate-300'}`}
                >
                  {template.name}
                </p>
                {!compact && (
                  <p className="truncate text-[10px] text-slate-600">{template.tagline}</p>
                )}
              </button>
            )
          })}
        </div>
      )}

      {!compact && (
        <p className="text-[10px] text-slate-600">
          Showing {templates.length} of {TEMPLATE_REGISTRY.length} templates
        </p>
      )}
    </div>
  )
}
