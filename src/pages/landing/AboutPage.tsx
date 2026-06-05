import { Shield, Heart, Globe, Code } from 'lucide-react'
import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'

const VALUES = [
  {
    icon: Shield,
    title: 'Privacy First',
    text: 'Your resume contains personal information. We believe it should stay on your device, not on our servers. ResumeForge stores everything locally in your browser.',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    text: 'Job searching is stressful enough without paywalls. Every feature — templates, export, customization — is free with no premium tier.',
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
        badge="About"
        title="A resume builder built for everyone"
        subtitle="ResumeForge was created to give job seekers a free, private, and powerful tool to build professional resumes without barriers."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 id="mission" className="text-2xl font-bold text-white">Our Mission</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-slate-400">
            <p>
              Too many qualified candidates get filtered out before a human ever reads their resume.
              Applicant tracking systems, poor formatting, and incomplete sections all work against
              you — and most resume tools charge money to fix these problems.
            </p>
            <p>
              ResumeForge exists to level the playing field. We provide a complete resume building
              platform — editor, templates, customization, and PDF export — at no cost and with no
              account required. Your data stays private, and you can start building in seconds.
            </p>
            <p>
              Whether you&apos;re writing your first resume or updating one after ten years in the
              industry, ResumeForge gives you the structure and tools to present your experience
              clearly and professionally.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-white">What we stand for</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/5 p-6"
              >
                <Icon size={22} className="text-violet-400" />
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="privacy" className="px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-500">
            <p>
              ResumeForge does not collect, store, or transmit any personal data. All resume
              information is saved locally in your browser using localStorage. When you export a
              PDF or JSON file, the file is generated on your device and saved to your local
              filesystem.
            </p>
            <p>
              We do not use analytics trackers, advertising cookies, or third-party data sharing.
              If you clear your browser data, your saved resume will be removed — use the JSON
              export feature to back up your work.
            </p>
            <p>
              This platform runs entirely client-side. No resume content is ever sent to a server.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">Who is this for?</h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            Students writing their first resume. Professionals switching careers. Freelancers
            updating their portfolio. Anyone who needs a clean, professional document without
            paying for a subscription or handing over personal data.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Students', 'Graduates', 'Career Changers', 'Freelancers', 'Professionals', 'Remote Workers'].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
