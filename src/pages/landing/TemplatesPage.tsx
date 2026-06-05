import { Link } from 'react-router-dom'
import { ArrowRight, Check, Shield } from 'lucide-react'
import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'
import { TEMPLATE_REGISTRY } from '../../templates/registry'

export function TemplatesPage() {
  return (
    <>
      <PageHero
        badge="10 ATS Templates"
        title="Professional templates that pass ATS filters"
        subtitle="Every template uses clean structure, standard fonts, and parseable layouts — optimized for applicant tracking systems and human recruiters alike."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            <Shield size={16} />
            All 10 templates are ATS-optimized
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {TEMPLATE_REGISTRY.map((template, index) => (
              <div
                key={template.id}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-violet-500/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-violet-400">#{index + 1}</span>
                    <h2 className="mt-1 text-xl font-bold text-white">{template.name}</h2>
                    <p className="mt-0.5 text-sm text-violet-300/80">{template.tagline}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">
                    ATS
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">{template.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {template.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="mt-4 space-y-1.5">
                  {template.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                      <Check size={12} className="shrink-0 text-violet-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06060c] px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">Switch templates anytime</h2>
          <p className="mt-3 text-slate-400">
            Your content stays intact when you change templates. Try all 10 and export the one
            that fits your target role.
          </p>
          <Link
            to="/builder"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Try All Templates
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
