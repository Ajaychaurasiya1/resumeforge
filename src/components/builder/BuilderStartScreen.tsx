import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  PenLine,
  Upload,
  FileJson,
  FileType,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useResume } from '../../context/ResumeContext'

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
  const { importResumeFile } = useResume()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

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
    <div className="flex min-h-screen flex-col bg-[#08080f]">
      <header className="border-b border-white/5 px-5 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-300"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-12">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600">
            <FileText size={28} className="text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            How would you like to start?
          </h1>
          <p className="mt-3 text-slate-400">
            Build a new resume from scratch or import an existing one to edit and improve.
          </p>
        </div>

        {hasSavedProgress && (
          <button
            onClick={onContinue}
            className="mt-10 w-full rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-left transition hover:border-violet-500/50 hover:bg-violet-500/15"
          >
            <p className="font-semibold text-violet-300">Continue where you left off</p>
            <p className="mt-1 text-sm text-slate-500">
              Resume your previous session with auto-saved progress
            </p>
          </button>
        )}

        <div className={`grid gap-5 sm:grid-cols-2 ${hasSavedProgress ? 'mt-5' : 'mt-10'}`}>
          <button
            onClick={onStartScratch}
            className="group rounded-2xl border border-white/10 bg-[#0f0f18] p-6 text-left transition hover:border-violet-500/40 hover:bg-[#13131f]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 transition group-hover:bg-violet-600/30">
              <PenLine size={24} />
            </div>
            <h2 className="mt-5 text-lg font-bold text-white">Build from Scratch</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Start with a blank resume and fill in each section step by step using our guided
              editor.
            </p>
          </button>

          <div className="rounded-2xl border border-white/10 bg-[#0f0f18] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
              <Upload size={24} />
            </div>
            <h2 className="mt-5 text-lg font-bold text-white">Import Existing Resume</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Upload a JSON, PDF, or text file. JSON imports everything; PDF/TXT use smart parsing
              for all sections — review and adjust after import.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.pdf,.txt,application/json,application/pdf,text/plain"
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
              className={`mt-5 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
                dragOver
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-white/10 hover:border-violet-500/40 hover:bg-white/[0.02]'
              }`}
            >
              {importing ? (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 size={24} className="animate-spin text-violet-400" />
                  <span className="text-sm">Importing resume…</span>
                </div>
              ) : (
                <>
                  <Upload size={20} className="mx-auto text-slate-500" />
                  <p className="mt-2 text-sm font-medium text-slate-300">
                    Drop file here or click to browse
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {[
                      { icon: FileJson, label: 'JSON' },
                      { icon: FileType, label: 'PDF' },
                      { icon: FileText, label: 'TXT' },
                    ].map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-500"
                      >
                        <Icon size={12} />
                        {label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
