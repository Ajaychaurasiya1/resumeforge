import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
} from 'lucide-react'
import { CtaBanner } from '../../components/landing/CtaBanner'
import {
  HOME_HERO_CHECKLIST,
  HOME_HERO_INCLUDES,
  HOME_FAQ,
  HOME_FEATURE_GROUPS,
  HOME_PILLARS,
  HOME_SECTIONS,
  HOME_STATS,
  HOME_STEPS,
  HOME_TEMPLATE_NAMES,
  HOME_USE_CASES,
} from '../../data/homeContent'
import { AtsScoreDemo } from '../../components/landing/AtsScoreDemo'

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">{children}</p>
  )
}

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.22)_0%,_transparent_55%)]" />
        <div className="pointer-events-none absolute -right-20 top-10 h-[28rem] w-[28rem] bg-[radial-gradient(circle,_rgba(99,102,241,0.12)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400">
                <Sparkles size={12} />
                Free, Private, ATS Ready
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                The complete resume platform,{' '}
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
                  built in your browser
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                ResumeForge combines a guided editor, 20 unique templates, categorized skills, job
                keyword matching, cover letters, snapshots, share links, and one click PDF export,
                with zero sign up and zero server storage.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Open Resume Builder
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/score"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  <Target size={16} />
                  Check ATS Score
                </Link>
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5"
                >
                  Browse Templates
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                {HOME_HERO_CHECKLIST.map(
                  (item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500/80" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Hero feature card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-2xl shadow-violet-950/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Everything included
              </p>
              <ul className="mt-4 space-y-3">
                {HOME_HERO_INCLUDES.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-slate-300">
                    <ChevronRight size={16} className="mt-0.5 shrink-0 text-violet-500" />
                    {line}
                  </li>
                ))}
              </ul>
              <Link
                to="/features"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-violet-300"
              >
                See full feature list
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {HOME_STATS.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-center"
              >
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Why ResumeForge</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              More than a template, a full career toolkit
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_PILLARS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature groups */}
      <section className="border-t border-white/5 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <SectionLabel>Platform features</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Everything we&apos;ve built, in one place
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              From smart editing and ATS tools to imports, exports, and sharing, ResumeForge covers
              the full resume workflow without switching apps.
            </p>
          </div>

          <div className="mt-16 space-y-20">
            {HOME_FEATURE_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="mb-8 border-b border-white/5 pb-6">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{group.title}</h3>
                  <p className="mt-2 text-slate-500">{group.subtitle}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.features.map(({ icon: Icon, name, detail }) => (
                    <div
                      key={name}
                      className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-violet-500/20"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/15 text-violet-400">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{name}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates strip */}
      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Templates</SectionLabel>
              <h2 className="mt-3 text-3xl font-bold text-white">20 unique resume layouts</h2>
              <p className="mt-3 max-w-xl text-slate-400">
                Visual previews with sample data. Switch templates anytime without losing content.
              </p>
            </div>
            <Link
              to="/templates"
              className="inline-flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              View all with previews
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {HOME_TEMPLATE_NAMES.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'One column ATS', text: 'Classic, Professional, Harvard, Legal, Corporate' },
              { label: 'Two column layouts', text: 'Modern, Metro sidebar · Split content columns' },
              { label: 'Specialized', text: 'Bold, Timeline, Creative, Startup, Europass, Academic' },
            ].map(({ label, text }) => (
              <div key={label} className="rounded-xl border border-white/5 p-5">
                <p className="font-semibold text-white">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="border-t border-white/5 px-5 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <SectionLabel>Resume sections</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold text-white">Cover every part of your career</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A scrollable step by step sidebar walks you through personal info, experience,
            education, skills, cover letter, and download, with completion tracking on each step.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {HOME_SECTIONS.map((section) => (
              <span
                key={section}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-slate-300"
              >
                {section}
              </span>
            ))}
          </div>
          <Link
            to="/builder"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Start with guided steps
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-3 text-3xl font-bold text-white">Six steps to a job-ready package</h2>
            </div>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Full walkthrough →
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_STEPS.map(({ step, title, text }) => (
              <div
                key={step}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <span className="text-3xl font-extrabold text-violet-500/40">{step}</span>
                <h3 className="mt-2 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS highlight */}
      <section className="border-t border-white/5 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10">
            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div>
                <SectionLabel>Stand out to recruiters & ATS</SectionLabel>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Match keywords before you apply
                </h2>
                <p className="mt-4 leading-relaxed text-slate-400">
                  Paste any job description in the builder to extract skills, highlight gaps, add
                  missing keywords in one click, and run a free ATS score check. No account needed.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/score"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    <Target size={16} />
                    Try ATS Score
                  </Link>
                  <Link
                    to="/builder"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                  >
                    Open job matcher
                  </Link>
                </div>
              </div>
              <div>
                <ul className="space-y-4">
                  {[
                    'Job profile + description scoring in builder and /score',
                    'Keyword highlights in preview when job text is saved',
                    'Smart bullet suggestions from job descriptions',
                    'Application kit ZIP: resume, cover letter, references',
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-300">
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <AtsScoreDemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Use cases</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold text-white">Built for every career stage</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {HOME_USE_CASES.map(({ title, flow, templates }) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{flow}</p>
                <p className="mt-3 text-xs text-violet-400">
                  Try: {templates.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold text-white">Common questions</h2>
          </div>
          <div className="mt-10 space-y-4">
            {HOME_FAQ.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-white/5 p-5">
                <h3 className="font-semibold text-white">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Learn more about our approach on{' '}
            <Link to="/about" className="text-violet-400 hover:text-violet-300">
              About Us
            </Link>
            ,{' '}
            <Link to="/mission" className="text-violet-400 hover:text-violet-300">
              Our Mission
            </Link>
            , and{' '}
            <Link to="/privacy" className="text-violet-400 hover:text-violet-300">
              Privacy
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
