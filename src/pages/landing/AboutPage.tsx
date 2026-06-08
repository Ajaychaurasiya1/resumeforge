import { Heart, Globe, Code } from 'lucide-react'
import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'
import { Link } from 'react-router-dom'

const VALUES = [
  {
    icon: Heart,
    title: 'Free Forever',
    text: 'Job searching is stressful enough without paywalls. Every feature, from templates to export and customization, is free with no premium tier.',
  },
  {
    icon: Globe,
    title: 'Accessible Anywhere',
    text: 'Works in any modern browser on desktop, tablet, or phone. No installation, no plugins, no account creation.',
  },
  {
    icon: Code,
    title: 'Open & Transparent',
    text: 'Built with React, TypeScript, and Tailwind CSS. A straightforward stack focused on speed, reliability, and a great editing experience.',
  },
]

export function AboutPage() {
  return (
    <>
      <PageHero
        badge="About Us"
        title="A resume builder built for everyone"
        subtitle="ResumeForge was created to give job seekers a free, private, and powerful tool to build professional resumes without barriers."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl space-y-4 leading-relaxed text-slate-400">
          <p>
            We started ResumeForge because great candidates deserve great tools, without signing up,
            paying monthly fees, or uploading sensitive career data to unknown servers.
          </p>
          <p>
            From ATS friendly templates to one click PDF export, everything is designed to help you
            move from blank page to interview-ready resume in minutes.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/mission"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500/40 hover:text-violet-400"
            >
              Read our mission →
            </Link>
            <Link
              to="/privacy"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500/40 hover:text-violet-400"
            >
              Privacy policy →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-white">What we stand for</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/5 p-6">
                <Icon size={22} className="text-violet-400" />
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
