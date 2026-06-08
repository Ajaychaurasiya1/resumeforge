import { useEffect, useMemo, useState } from 'react'
import { Briefcase, Check, Lightbulb, Plus, X } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { suggestBulletsFromJob } from '../../utils/bulletSuggestions'
import { extractKeywords, matchSkills } from '../../utils/jobMatcher'
import { getFlatSkills } from '../../utils/skills'
import { saveJobKeywords } from '../../utils/keywordHighlight'
import { generateCoverLetterFromJob } from '../../utils/coverLetterFromJob'

export function JobMatcherPanel() {
  const { resume, jobTarget, updateJobTarget, addSkills, updateCoverLetter, updateResume } =
    useResume()
  const [added, setAdded] = useState(false)

  const resumeText = useMemo(() => {
    return [
      resume.summary,
      ...resume.experience.map((e) => `${e.position} ${e.company} ${e.description}`),
      ...resume.projects.map((p) => `${p.name} ${p.description} ${p.technologies}`),
    ].join(' ')
  }, [resume])

  const keywords = useMemo(
    () => extractKeywords(`${jobTarget.jobTitle} ${jobTarget.jobDescription}`),
    [jobTarget.jobTitle, jobTarget.jobDescription],
  )

  const flatSkills = useMemo(() => getFlatSkills(resume.skillCategories), [resume.skillCategories])
  const match = useMemo(
    () => matchSkills(flatSkills, resumeText, keywords),
    [flatSkills, resumeText, keywords],
  )

  const bulletSuggestions = useMemo(
    () =>
      suggestBulletsFromJob(jobTarget.jobTitle, jobTarget.jobDescription, resume.experience),
    [jobTarget.jobTitle, jobTarget.jobDescription, resume.experience],
  )

  useEffect(() => {
    if (jobTarget.jobDescription.trim()) {
      saveJobKeywords([...match.matched, ...match.missing].slice(0, 40))
    }
  }, [jobTarget.jobDescription, match.matched, match.missing])

  const handleAddMissing = () => {
    addSkills(match.missing)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const applyBullet = (text: string, experienceId?: string) => {
    if (!experienceId) return
    updateResume({
      experience: resume.experience.map((exp) =>
        exp.id === experienceId
          ? { ...exp, description: exp.description ? `${exp.description}\n${text}` : text }
          : exp,
      ),
    })
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <Briefcase size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">Job Description Matcher</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Saved per resume slot. Used for ATS score, keywords, and cover letter.
      </p>

      <input
        type="text"
        value={jobTarget.companyName}
        onChange={(e) => updateJobTarget({ companyName: e.target.value })}
        placeholder="Company name (optional)"
        className="mt-3 w-full rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
      />

      <textarea
        value={jobTarget.jobDescription}
        onChange={(e) => {
          updateJobTarget({ jobDescription: e.target.value })
          setAdded(false)
        }}
        rows={4}
        placeholder="Paste job description here..."
        className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-violet-500"
      />

      {jobTarget.jobDescription.trim() && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Keyword match</span>
            <span
              className={`text-lg font-bold ${
                match.score >= 70
                  ? 'text-emerald-400'
                  : match.score >= 40
                    ? 'text-amber-400'
                    : 'text-rose-400'
              }`}
            >
              {match.score}%
            </span>
          </div>

          {match.matched.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-emerald-400">Matched keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {match.matched.slice(0, 20).map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300"
                  >
                    <Check size={10} />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {match.missing.length > 0 && (
            <div>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-amber-400">Missing keywords</p>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={handleAddMissing}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/30"
                  >
                    <Plus size={12} />
                    {added ? 'Added to Skills' : `Add all (${match.missing.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateCoverLetter(
                        generateCoverLetterFromJob(resume, jobTarget.jobDescription),
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-violet-500/30 px-2.5 py-1 text-xs text-violet-300 hover:bg-violet-500/10"
                  >
                    Cover letter
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {match.missing.slice(0, 15).map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300"
                  >
                    <X size={10} />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {bulletSuggestions.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-violet-300">
                <Lightbulb size={12} />
                Suggested experience bullets
              </p>
              <ul className="space-y-2">
                {bulletSuggestions.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-lg border border-white/5 bg-[#0f0f18] px-3 py-2 text-xs"
                  >
                    <p className="text-slate-400">{s.reason}</p>
                    <p className="mt-1 text-slate-300">{s.text}</p>
                    {s.experienceId && (
                      <button
                        type="button"
                        onClick={() => applyBullet(s.text, s.experienceId)}
                        className="mt-2 text-violet-400 hover:text-violet-300"
                      >
                        Add to experience
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
