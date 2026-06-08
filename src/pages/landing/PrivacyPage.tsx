import { Shield } from 'lucide-react'
import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'

const POLICY_POINTS = [
  {
    title: 'Local storage only',
    text: 'ResumeForge does not collect, store, or transmit your personal data. All resume information is saved locally in your browser using localStorage.',
  },
  {
    title: 'Exports stay on your device',
    text: 'When you export a PDF, DOCX, or JSON file, the file is generated on your device and saved to your local filesystem.',
  },
  {
    title: 'No tracking',
    text: 'We do not run analytics trackers, advertising cookies, or third party data sharing for your resume content.',
  },
  {
    title: 'Back up your work',
    text: 'If you clear your browser data, your saved resume will be removed. Use JSON export to keep a backup you control.',
  },
]

export function PrivacyPage() {
  return (
    <>
      <PageHero
        badge="Privacy"
        title="Your data stays yours"
        subtitle="ResumeForge runs entirely in your browser. No accounts, no cloud uploads, and no resume content sent to our servers."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start gap-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
            <Shield size={24} className="shrink-0 text-violet-400" />
            <p className="text-sm leading-relaxed text-slate-400">
              This platform is client-side by design. Building, editing, previewing, and exporting
              your resume happens on your machine, not on a remote database.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {POLICY_POINTS.map(({ title, text }) => (
              <div key={title}>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs text-slate-600">
            Last updated: June 2026. Questions? ResumeForge is a free tool. Your privacy is protected
            by keeping your data on your device.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
