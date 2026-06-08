import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Search, Shield } from 'lucide-react'
import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'
import { ResumeTemplate } from '../../components/templates/ResumeTemplate'
import { TEMPLATE_FILTER_OPTIONS, filterTemplates } from '../../templates/registry'
import { getTemplatePreviewData, PREVIEW_PAGE_WIDTH } from '../../utils/templatePreviewData'
import type { TemplateCategory } from '../../types/resume'

export function TemplatesPage() {
  const [filter, setFilter] = useState<TemplateCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const templates = filterTemplates(filter).filter((t) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  })

  return (
    <>
      <PageHero
        badge="20 Unique Templates"
        title="Professional templates that pass ATS filters"
        subtitle="Every template follows clean structure, standard fonts, and parseable layouts. Click Use this template to open the builder with your choice pre-selected."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 relative max-w-md mx-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-slate-300 outline-none focus:border-violet-500"
            />
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {TEMPLATE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filter === opt.id
                    ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                    : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mb-10 flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            <Shield size={16} />
            {templates.length} template{templates.length === 1 ? '' : 's'} shown, full-page previews
          </div>

          <div className="space-y-12">
            {templates.map((template, index) => {
              const previewData = getTemplatePreviewData(template.id)
              return (
                <article
                  key={template.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6"
                >
                  <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
                    <div>
                      <div
                        className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-lg"
                        style={{ maxHeight: 420 }}
                      >
                        <div
                          style={{
                            width: PREVIEW_PAGE_WIDTH,
                            transform: 'scale(0.42)',
                            transformOrigin: 'top left',
                            height: 560,
                          }}
                        >
                          <div className="bg-white p-8">
                            <ResumeTemplate data={previewData} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-violet-400">#{index + 1}</span>
                      <h2 className="mt-0.5 text-xl font-bold text-white">{template.name}</h2>
                      <p className="text-sm text-violet-300/80">{template.tagline}</p>
                      {template.atsOptimized && (
                        <span className="mt-2 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">
                          ATS
                        </span>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">{template.description}</p>
                      <ul className="mt-3 space-y-1">
                        {template.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                            <Check size={12} className="shrink-0 text-violet-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/builder?template=${template.id}&start=1`}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
                      >
                        Use this template
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06060c] px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">Switch templates anytime</h2>
          <p className="mt-3 text-slate-400">
            Your content stays intact when you change templates. Try all 20 and export the one
            that fits your target role.
          </p>
          <Link
            to="/builder"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Open Builder
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
