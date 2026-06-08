import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { BuilderSection } from '../../utils/sectionConfig'

const STORAGE_KEY = 'resume-forge-onboarding-done'

const STEPS: { section: BuilderSection; title: string; body: string }[] = [
  {
    section: 'personal',
    title: 'Start with Personal',
    body: 'Add your name, email, and contact details first — recruiters need this at the top.',
  },
  {
    section: 'summary',
    title: 'Write your Summary',
    body: 'A short professional summary (20–80 words) helps ATS and recruiters understand your fit.',
  },
  {
    section: 'preview',
    title: 'Download & Customize',
    body: 'Pick a template, check your ATS score, and export a text-based PDF.',
  },
  {
    section: 'preview',
    title: 'Share your resume',
    body: 'Copy a clean /view/ link on the Download tab to send recruiters a read-only preview.',
  },
]

interface Props {
  onNavigate: (section: BuilderSection) => void
}

export function OnboardingTour({ onNavigate }: Props) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  if (!visible || step >= STEPS.length) return null

  const current = STEPS[step]

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const next = () => {
    onNavigate(current.section)
    if (step >= STEPS.length - 1) finish()
    else setStep((s) => s + 1)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={finish} aria-label="Dismiss tour" />
      <div className="relative w-full max-w-md rounded-2xl border border-violet-500/30 bg-[#13131f] p-5 shadow-2xl">
        <button
          type="button"
          onClick={finish}
          className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 hover:bg-white/5"
        >
          <X size={16} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          Step {step + 1} of {STEPS.length}
        </p>
        <h3 className="mt-2 text-lg font-bold text-white">{current.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{current.body}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={finish}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 hover:bg-white/5"
          >
            Skip tour
          </button>
          <button
            type="button"
            onClick={next}
            className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            {step >= STEPS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function resetOnboardingTour(): void {
  localStorage.removeItem(STORAGE_KEY)
}
