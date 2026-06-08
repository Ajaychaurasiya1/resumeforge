import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Target,
  Upload,
  User,
} from 'lucide-react'
import { importResumeFile, importTextContent } from '../utils/importResume'
import { computeAtsAnalysis, type AtsCheck } from '../utils/atsScore'
import type { ResumeData } from '../types/resume'

type ProfileMode = 'upload' | 'paste'

function scoreColorClass(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-rose-400'
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/5">
      <div
        className={`h-full rounded-full transition-all ${
          score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
        }`}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

function CheckList({ checks }: { checks: AtsCheck[] }) {
  return (
    <ul className="space-y-2">
      {checks.map((check) => (
        <li
          key={check.id}
          className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#1a1a27] px-4 py-3"
        >
          {check.passed ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          )}
          <div>
            <p className="text-sm text-slate-300">{check.label}</p>
            {!check.passed && <p className="text-xs text-slate-500">{check.tip}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

function StepBadge({ n, done }: { n: number; done?: boolean }) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        done ? 'bg-emerald-600 text-white' : 'bg-violet-600 text-white'
      }`}
    >
      {done ? <CheckCircle2 size={14} /> : n}
    </span>
  )
}

export function ScorePage() {
  const [profileMode, setProfileMode] = useState<ProfileMode>('upload')
  const [profileText, setProfileText] = useState('')
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const profileReady = !!resume
  const jobTitleReady = jobTitle.trim().length >= 2
  const jobDescReady = jobDescription.trim().length >= 40
  const canCalculate = profileReady && jobTitleReady && jobDescReady

  const analysis = useMemo(() => {
    if (!submitted || !resume || !canCalculate) return null
    return computeAtsAnalysis(resume, jobTitle, jobDescription)
  }, [submitted, resume, jobTitle, jobDescription, canCalculate])

  const resetResults = () => setSubmitted(false)

  const parseProfileText = (text: string) => {
    try {
      setResume(importTextContent(text))
      setError(null)
      resetResults()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not parse resume text.')
      setResume(null)
    }
  }

  const handleUpload = async (file: File | null) => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      setResume(await importResumeFile(file))
      resetResults()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume.')
      setResume(null)
    } finally {
      setLoading(false)
    }
  }

  const handleUsePastedProfile = () => {
    if (!profileText.trim()) {
      setError('Paste your resume content first.')
      return
    }
    parseProfileText(profileText)
  }

  const handleCalculate = () => {
    if (!resume) {
      setError('Upload your resume first.')
      return
    }
    if (!jobTitleReady) {
      setError('Enter the job profile you are applying for, e.g. Software Engineer.')
      return
    }
    if (!jobDescReady) {
      setError('Paste the job description with at least 40 characters.')
      return
    }
    setError(null)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-slate-300">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Sparkles size={18} />
            </div>
            <span className="font-bold text-white">ResumeForge ATS Score</span>
          </Link>
          <Link
            to="/builder"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Open Builder
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
            <Target size={14} />
            Resume + job profile + description
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">Check your ATS score for a role</h1>
          <p className="mt-2 text-slate-500">
            Upload your resume, enter the job profile, paste the description, then get your score.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {/* Step 1: Upload resume */}
          <section className="rounded-2xl border border-white/5 bg-[#0f0f18] p-5">
            <div className="flex items-center gap-3">
              <StepBadge n={1} done={profileReady} />
              <div>
                <h2 className="text-sm font-semibold text-white">Upload your resume</h2>
                <p className="text-xs text-slate-500">
                  PDF, DOCX, TXT, or JSON. We read skills, experience, and summary.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {(['upload', 'paste'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setProfileMode(mode)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    profileMode === mode
                      ? 'bg-violet-600 text-white'
                      : 'border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'upload' ? 'Upload file' : 'Paste text'}
                </button>
              ))}
            </div>

            {profileMode === 'upload' ? (
              <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-white/10 bg-[#1a1a27] px-6 py-10 transition hover:border-violet-500/40 hover:bg-violet-500/5">
                <Upload size={28} className="text-violet-400" />
                <span className="mt-3 text-sm font-medium text-slate-300">
                  {loading ? 'Analyzing...' : 'Click to upload resume'}
                </span>
                <span className="mt-1 text-xs text-slate-600">.pdf, .docx, .txt, .json</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.json,application/pdf"
                  className="hidden"
                  disabled={loading}
                  onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
                />
              </label>
            ) : (
              <div className="mt-4 space-y-3">
                <textarea
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  rows={8}
                  placeholder="Paste your full resume here..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#1a1a27] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-500/50"
                />
                <button
                  type="button"
                  onClick={handleUsePastedProfile}
                  className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
                >
                  Use pasted resume
                </button>
              </div>
            )}

            {profileReady && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                <CheckCircle2 size={16} />
                Resume loaded
                {resume?.personalInfo.fullName && `: ${resume.personalInfo.fullName}`}
              </div>
            )}
          </section>

          {/* Step 2: Job profile */}
          <section
            className={`rounded-2xl border bg-[#0f0f18] p-5 transition ${
              profileReady ? 'border-white/5' : 'border-white/5 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <StepBadge n={2} done={jobTitleReady && profileReady} />
              <div>
                <h2 className="text-sm font-semibold text-white">Job profile</h2>
                <p className="text-xs text-slate-500">
                  The role you are applying for, e.g. Software Engineer or Marketing Intern.
                </p>
              </div>
            </div>
            <input
              type="text"
              value={jobTitle}
              disabled={!profileReady}
              onChange={(e) => {
                setJobTitle(e.target.value)
                resetResults()
              }}
              placeholder="e.g. Software Engineer"
              className="mt-4 w-full rounded-xl border border-white/10 bg-[#1a1a27] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-500/50 disabled:cursor-not-allowed"
            />
          </section>

          {/* Step 3: Job description */}
          <section
            className={`rounded-2xl border bg-[#0f0f18] p-5 transition ${
              profileReady ? 'border-white/5' : 'border-white/5 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <StepBadge n={3} done={jobDescReady && profileReady} />
              <div>
                <h2 className="text-sm font-semibold text-white">Job description</h2>
                <p className="text-xs text-slate-500">
                  Paste responsibilities, required skills, and qualifications from the posting.
                </p>
              </div>
            </div>
            <textarea
              value={jobDescription}
              disabled={!profileReady}
              onChange={(e) => {
                setJobDescription(e.target.value)
                resetResults()
              }}
              rows={10}
              placeholder="Paste the full job description here..."
              className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-[#1a1a27] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-500/50 disabled:cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-slate-600">
              {jobDescription.trim().length} characters
              {profileReady && !jobDescReady && ' · add at least 40 characters'}
            </p>
          </section>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCalculate}
            disabled={!canCalculate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Target size={16} />
            Calculate ATS score
          </button>

          {!profileReady && (
            <p className="text-center text-xs text-slate-600">
              Upload your resume to unlock job profile and description fields.
            </p>
          )}
        </div>

        {analysis && (
          <div className="mt-10 space-y-8">
            <div className="rounded-2xl border border-white/5 bg-[#1a1a27] p-6 text-center">
              <p className="text-sm text-slate-500">ATS score for</p>
              <p className="mt-1 text-lg font-semibold text-white">{analysis.jobTitle}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                {resume?.personalInfo.fullName || 'Your resume'}
              </p>
              <p className={`mt-4 text-5xl font-bold ${scoreColorClass(analysis.score)}`}>
                {analysis.score}%
              </p>
              <ScoreBar score={analysis.score} />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-[#0f0f18] p-4">
                  <p className="text-xs text-slate-500">Resume quality</p>
                  <p className={`mt-1 text-2xl font-bold ${scoreColorClass(analysis.profileScore)}`}>
                    {analysis.profileScore}%
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-[#0f0f18] p-4">
                  <p className="text-xs text-slate-500">Job keyword match</p>
                  <p className={`mt-1 text-2xl font-bold ${scoreColorClass(analysis.jobMatchScore)}`}>
                    {analysis.jobMatchScore}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <User size={16} className="text-violet-400" />
                Resume quality checks
              </h3>
              <div className="mt-3">
                <CheckList checks={analysis.profileChecks} />
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Briefcase size={16} className="text-violet-400" />
                Job fit checks ({analysis.jobTitle})
              </h3>
              <div className="mt-3">
                <CheckList checks={analysis.jobChecks} />
              </div>
            </div>

            {analysis.keywordMatch.matched.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-emerald-400">Matched keywords</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.keywordMatch.matched.slice(0, 24).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.keywordMatch.missing.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-amber-400">Missing keywords</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Add these to your skills, summary, or experience to improve your score.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.keywordMatch.missing.slice(0, 24).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/builder"
                className="inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Improve in Resume Builder
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
