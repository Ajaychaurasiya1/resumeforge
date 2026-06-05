import {
  Eye,
  Download,
  Palette,
  Shield,
  Undo2,
  Save,
  Layout,
  Type,
  ListOrdered,
  Sparkles,
  Printer,
  HardDrive,
} from 'lucide-react'
import { PageHero } from '../../components/landing/PageHero'
import { CtaBanner } from '../../components/landing/CtaBanner'

const FEATURE_GROUPS = [
  {
    title: 'Editing & Content',
    description: 'Powerful tools to write and organize your resume content.',
    features: [
      {
        icon: Eye,
        name: 'Live Preview',
        detail: 'See changes instantly in a side-by-side preview panel. No refresh, no guesswork.',
      },
      {
        icon: Layout,
        name: 'Tabbed Sections',
        detail: 'Personal, Experience, Education, and Skills tabs keep the editor clean and focused.',
      },
      {
        icon: ListOrdered,
        name: 'Drag-Free Reordering',
        detail: 'Move sections up or down to control what recruiters see first.',
      },
      {
        icon: Undo2,
        name: 'Undo & Redo',
        detail: 'Full edit history with up to 50 undo steps. Experiment freely without fear.',
      },
      {
        icon: Sparkles,
        name: 'Sample Data',
        detail: 'Load a pre-filled example resume to explore the platform before entering your own details.',
      },
    ],
  },
  {
    title: 'Design & Templates',
    description: 'Make your resume look professional with flexible design options.',
    features: [
      {
        icon: Palette,
        name: 'Accent Colors',
        detail: 'Choose from indigo, blue, emerald, rose, or slate accent colors for Modern and Minimal templates.',
      },
      {
        icon: Type,
        name: 'Font Sizes',
        detail: 'Switch between small, medium, and large text to fit more content or improve readability.',
      },
      {
        icon: Layout,
        name: '10 ATS Templates',
        detail: 'Classic, Modern, Minimal, Professional, Executive, Compact, Harvard, Chronological, Technical, and Elegant.',
      },
      {
        icon: Eye,
        name: 'Section Visibility',
        detail: 'Hide sections you don\'t need — like Projects or Languages — without deleting the data.',
      },
    ],
  },
  {
    title: 'Export & Data',
    description: 'Keep your work safe and get it into recruiters\' hands.',
    features: [
      {
        icon: Printer,
        name: 'PDF Export',
        detail: 'One-click export via the browser print dialog. Save as PDF with no watermarks.',
      },
      {
        icon: Save,
        name: 'JSON Backup',
        detail: 'Download your entire resume as a JSON file for backup or transfer to another device.',
      },
      {
        icon: Download,
        name: 'JSON Import',
        detail: 'Restore a previously saved resume file to pick up right where you left off.',
      },
      {
        icon: HardDrive,
        name: 'Auto-Save',
        detail: 'Every change is saved to localStorage automatically. Your work persists between sessions.',
      },
      {
        icon: Shield,
        name: 'Local-Only Storage',
        detail: 'No servers, no accounts. Your personal data never leaves your browser.',
      },
    ],
  },
]

const SECTIONS = [
  { name: 'Personal Information', fields: 'Name, email, phone, location, LinkedIn, website' },
  { name: 'Professional Summary', fields: 'A concise overview of your background and strengths' },
  { name: 'Work Experience', fields: 'Company, role, dates, location, bullet-point descriptions' },
  { name: 'Education', fields: 'Institution, degree, field of study, GPA, dates' },
  { name: 'Skills', fields: 'Tag-based skill list with easy add and remove' },
  { name: 'Projects', fields: 'Name, URL, technologies, description' },
  { name: 'Certifications', fields: 'Name, issuer, date earned, credential URL' },
  { name: 'Languages', fields: 'Language name and proficiency level' },
]

export function FeaturesPage() {
  return (
    <>
      <PageHero
        badge="Features"
        title="Built for serious job seekers"
        subtitle="ResumeForge packs everything you need into a single, fast, browser-based tool — no subscriptions, no complexity."
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl space-y-20">
          {FEATURE_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">{group.title}</h2>
                <p className="mt-2 text-slate-500">{group.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.features.map(({ icon: Icon, name, detail }) => (
                  <div
                    key={name}
                    className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06060c] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white">Every resume section covered</h2>
          <p className="mt-2 text-slate-500">
            Recruiters expect a complete picture. ResumeForge supports all standard sections.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {SECTIONS.map(({ name, fields }) => (
              <div
                key={name}
                className="rounded-2xl border border-white/5 p-5"
              >
                <h3 className="font-semibold text-white">{name}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{fields}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
