import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'

const STEPS = [
  {
    number: '01',
    title: 'Open the Resume Builder',
    description:
      'Click "Start Building" from any page to open the editor. No account, no download, no waiting. The builder loads instantly in your browser.',
    tips: ['Works on Chrome, Firefox, Safari, and Edge', 'No internet required after first load'],
  },
  {
    number: '02',
    title: 'Fill in the Personal tab',
    description:
      'Start with your name, contact details, and a professional summary. This is the first thing recruiters see, so make it count.',
    tips: [
      'Include email and phone or location at minimum',
      'Keep your summary between 20–80 words',
      'Add your LinkedIn URL if you have one',
    ],
  },
  {
    number: '03',
    title: 'Add your Experience',
    description:
      'List your work history with company, role, dates, and bullet-point achievements. Use one bullet per line — they render as a list in the preview.',
    tips: [
      'Start bullets with action verbs: Led, Built, Improved',
      'Include numbers where possible: "Increased sales by 40%"',
      'Check "I currently work here" for your present role',
    ],
  },
  {
    number: '04',
    title: 'Complete Education & Skills',
    description:
      'Add your degrees and a skills list relevant to your target role. The Skills tab also includes Projects, Certifications, and Languages.',
    tips: [
      'List at least 5 skills for a strong resume',
      'Add certifications if they\'re relevant to the role',
      'Projects are great for developers and designers',
    ],
  },
  {
    number: '05',
    title: 'Choose a template & customize',
    description:
      'Choose from 10 ATS templates in the header dropdown. Open Customize to change accent color, font size, and section order.',
    tips: [
      'Professional and Executive suit corporate roles',
      'Technical and Modern work well for tech industries',
      'Hide sections you don\'t need without losing the data',
    ],
  },
  {
    number: '06',
    title: 'Export your resume',
    description:
      'When you\'re happy with the preview, click "Export PDF" to open the print dialog. Choose "Save as PDF" as the destination and download your finished resume.',
    tips: [
      'Use "Save JSON" to back up your data',
      'Your work auto-saves — you can return anytime',
      'Load Sample to see a fully filled example first',
    ],
  },
]

const FAQ = [
  {
    q: 'Do I need to create an account?',
    a: 'No. ResumeForge runs entirely in your browser with no sign-up required.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Locally in your browser\'s storage. It never leaves your device unless you export it.',
  },
  {
    q: 'Can I use it on mobile?',
    a: 'Yes, though the editor works best on a tablet or desktop for the side-by-side preview.',
  },
  {
    q: 'Is the PDF export really free?',
    a: 'Yes. Export as many PDFs as you want with no watermarks or limits.',
  },
]

export function HowItWorksPage() {
  return (
    <>
      <PageHero
        badge="How It Works"
        title="From blank page to finished resume in minutes"
        subtitle="A step-by-step walkthrough of how to use ResumeForge to create a professional, export-ready resume."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl space-y-16">
          {STEPS.map((step) => (
            <div key={step.number} className="relative pl-0 sm:pl-20">
              <span className="mb-4 inline-block text-5xl font-extrabold text-white/10 sm:absolute sm:left-0 sm:top-0">
                {step.number}
              </span>
              <h2 className="text-xl font-bold text-white">{step.title}</h2>
              <p className="mt-3 leading-relaxed text-slate-400">{step.description}</p>
              <ul className="mt-4 space-y-2">
                {step.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-violet-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Open the Builder
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>
          <div className="mt-10 space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-white/5 p-6">
                <h3 className="font-semibold text-white">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
