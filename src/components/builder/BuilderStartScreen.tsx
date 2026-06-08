import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  PenLine,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { useResume } from '../../context/ResumeContext'

const STEPS = [
  {
    num: 1,
    title: 'Upload Resume',
    desc: 'Upload your current resume (PDF, TXT, or JSON format).',
  },
  {
    num: 2,
    title: 'Proofread Content',
    desc: 'Review parsed content and make changes or add sections as needed.',
  },
  {
    num: 3,
    title: 'Section Editor',
    desc: 'Fill each section step by step with our guided editor.',
  },
  {
    num: 4,
    title: 'Layout & Formatting',
    desc: 'Customize templates, section order, and visibility, then preview.',
  },
  {
    num: 5,
    title: 'Download Resume',
    desc: 'Download your resume as PDF with a single click.',
  },
  {
    num: 6,
    title: 'Free Resume Creation',
    desc: 'No sign-up, no payments — just build and export your resume.',
  },
]

interface Props {
  onStartScratch: () => void
  onImportSuccess: () => void
  onContinue: () => void
  hasSavedProgress: boolean
}

export function BuilderStartScreen({
  onStartScratch,
  onImportSuccess,
  onContinue,
  hasSavedProgress,
}: Props) {
  const { importResumeFile, importPastedText } = useResume()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [linkedInText, setLinkedInText] = useState('')
  const [pastingLinkedIn, setPastingLinkedIn] = useState(false)

  const handleFile = async (file: File) => {
    setError('')
    setImporting(true)
    try {
      await importResumeFile(file)
      onImportSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import resume.')
    } finally {
      setImporting(false)
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
    e.target.value = ''
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) await handleFile(file)
  }

  return (
    <div className="min-h-screen bg-[#08080f]">
      <header className="border-b border-white/5 px-5 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-300"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1fr_340px] lg:py-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">Upload</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Improve your resume in a few clicks!
          </h1>

          {hasSavedProgress && (
            <button
              onClick={onContinue}
              className="mt-6 w-full rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-left transition hover:border-violet-500/50 hover:bg-violet-500/15"
            >
              <p className="font-semibold text-violet-300">Continue where you left off</p>
              <p className="mt-1 text-sm text-slate-500">Your progress is auto-saved locally</p>
            </button>
          )}

          <button
            onClick={onStartScratch}
            className={`group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0f0f18] p-5 text-left transition hover:border-violet-500/40 hover:bg-[#13131f] ${hasSavedProgress ? 'mt-4' : 'mt-8'}`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 transition group-hover:bg-violet-600/30">
              <PenLine size={22} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Make From Scratch</p>
              <p className="mt-0.5 text-sm text-slate-500">Start blank and fill sections step by step</p>
            </div>
          </button>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0f0f18] p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.pdf,.docx,.txt,application/json,application/pdf,text/plain"
              onChange={onFileChange}
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragOver
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-white/10 hover:border-violet-500/40 hover:bg-white/[0.02]'
              }`}
            >
              {importing ? (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Loader2 size={28} className="animate-spin text-violet-400" />
                  <p className="text-sm font-medium">Your resume is being uploaded…</p>
                  <p className="text-xs text-slate-500">Please wait a few seconds</p>
                </div>
              ) : (
                <>
                  <Upload size={28} className="mx-auto text-slate-500" />
                  <p className="mt-3 text-sm font-semibold text-slate-300">
                    Select a file or drag and drop here
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Supported: .pdf, .docx, .txt, .json (max 20MB)
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="mt-5 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
              Improve Your Resume
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0f0f18] p-6">
            <p className="text-sm font-semibold text-slate-300">Import from LinkedIn</p>
            <p className="mt-1 text-xs text-slate-500">
              Paste your LinkedIn profile text (About, Experience, Skills sections).
            </p>
            <textarea
              value={linkedInText}
              onChange={(e) => setLinkedInText(e.target.value)}
              rows={5}
              spellCheck
              placeholder="Paste LinkedIn profile content here..."
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#08080f] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-violet-500"
            />
            <button
              type="button"
              disabled={!linkedInText.trim() || pastingLinkedIn}
              onClick={async () => {
                setError('')
                setPastingLinkedIn(true)
                try {
                  importPastedText(linkedInText)
                  onImportSuccess()
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Failed to parse LinkedIn text.')
                } finally {
                  setPastingLinkedIn(false)
                }
              }}
              className="mt-3 w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-50"
            >
              {pastingLinkedIn ? 'Parsing…' : 'Import LinkedIn Profile'}
            </button>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-[#0f0f18] p-6 lg:sticky lg:top-8 lg:self-start">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={18} className="text-violet-400" />
            <h2 className="text-lg font-bold text-white">Steps to follow</h2>
          </div>
          <ol className="space-y-5">
            {STEPS.map(({ num, title, desc }) => (
              <li key={num} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-xs font-bold text-violet-300">
                  {num}
                </span>
                <div>
                  <p className="font-semibold text-slate-200">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-xs leading-relaxed text-emerald-300/90">
              100% free — no account required. Your data stays in your browser.
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}
