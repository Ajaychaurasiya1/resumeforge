import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  Download,
  Palette,
  Shield,
  Zap,
  FileText,
  Layers,
  Clock,
} from 'lucide-react'
import { CtaBanner } from '../../components/landing/CtaBanner'

const STATS = [
  { value: '10', label: 'ATS templates' },
  { value: '7+', label: 'Resume sections' },
  { value: '100%', label: 'Free to use' },
  { value: '0', label: 'Account required' },
]

const HIGHLIGHTS = [
  {
    icon: Eye,
    title: 'Live Preview',
    description:
      'Watch your resume update in real time as you type. What you see is exactly what you export.',
  },
  {
    icon: Palette,
    title: 'Fully Customizable',
    description:
      'Pick accent colors, adjust font sizes, reorder sections, and hide anything you don\'t need.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description:
      'Export a print-ready PDF directly from your browser. No watermarks, no paywalls.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description:
      'Your resume data is stored locally in your browser. Nothing is sent to a server.',
  },
  {
    icon: Zap,
    title: 'Fast & Lightweight',
    description:
      'No heavy downloads or plugins. Open the builder and start editing in seconds.',
  },
  {
    icon: Layers,
    title: 'ATS-Friendly Layouts',
    description:
      'Clean, structured templates designed to pass applicant tracking systems.',
  },
]

const STEPS = [
  { step: '01', title: 'Fill in your details', text: 'Add personal info, work history, education, and skills using our guided tabbed editor.' },
  { step: '02', title: 'Choose a template', text: 'Switch between Classic, Modern, and Minimal designs to match your industry and style.' },
  { step: '03', title: 'Customize & preview', text: 'Adjust colors, fonts, and section order while watching the live preview update.' },
  { step: '04', title: 'Export & apply', text: 'Download your resume as a PDF and start applying to jobs immediately.' },
]

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.2)_0%,_transparent_50%)]" />
        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 bg-[radial-gradient(circle,_rgba(99,102,241,0.1)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400">
              <Zap size={12} />
              Free Resume Builder Platform
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Build a resume that{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                gets you hired
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              ResumeForge is a free, browser-based platform for creating professional resumes.
              Edit with a live preview, choose from multiple templates, customize every detail,
              and export to PDF — all without creating an account.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Start Building Free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-7 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5"
              >
                Explore Features
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ value, label }) => (
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

      {/* Overview */}
      <section className="border-t border-white/5 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Platform Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Everything you need to create a standout resume
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              ResumeForge combines a powerful editor, beautiful templates, and instant PDF export
              into one simple tool. Whether you&apos;re a fresh graduate or a seasoned professional,
              our platform guides you through every section so nothing gets missed.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-violet-500/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 transition group-hover:bg-violet-600/30">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
                Simple Process
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">Four steps to a finished resume</h2>
            </div>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Full guide →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ step, title, text }) => (
              <div key={step} className="relative rounded-2xl border border-white/5 p-6">
                <span className="text-4xl font-extrabold text-white/10">{step}</span>
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections covered */}
      <section className="border-t border-white/5 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Comprehensive Sections
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">Cover every part of your career</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Our editor supports all the sections recruiters expect — from contact details
              to certifications and languages.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              'Personal Info', 'Summary', 'Experience', 'Education',
              'Skills', 'Projects', 'Certifications', 'Languages',
            ].map((section) => (
              <span
                key={section}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300"
              >
                {section}
              </span>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: 'Tabbed Editor',
                text: 'Organized into Personal, Experience, Education, and Skills tabs so you never feel overwhelmed.',
              },
              {
                icon: Clock,
                title: 'Auto-Save',
                text: 'Your progress is saved automatically to your browser. Close the tab and come back anytime.',
              },
              {
                icon: Layers,
                title: 'Section Control',
                text: 'Reorder, show, or hide any section. Put what matters most at the top.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
                <Icon size={24} className="mx-auto text-violet-400" />
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
