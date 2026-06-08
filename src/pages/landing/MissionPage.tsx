import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'

export function MissionPage() {
  return (
    <>
      <PageHero
        badge="Our Mission"
        title="Level the playing field for every job seeker"
        subtitle="We believe professional resume tools should be free, private, and accessible to everyone, not locked behind paywalls or data collection."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4 leading-relaxed text-slate-400">
            <p>
              Too many qualified candidates get filtered out before a human ever reads their resume.
              Applicant tracking systems, poor formatting, and incomplete sections all work against
              you, and most resume tools charge money to fix these problems.
            </p>
            <p>
              ResumeForge exists to level the playing field. We provide a complete resume building
              platform with editor, templates, customization, and PDF export at no cost and with no
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
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">Who we build for</h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            Students, graduates, career changers, freelancers, and experienced professionals who need
            a clean, ATS-friendly resume without subscriptions or compromising their personal data.
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
