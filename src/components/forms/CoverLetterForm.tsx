import { useState } from 'react'
import { Mail, Sparkles, Briefcase } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { generateCoverLetterFromJob } from '../../utils/coverLetterFromJob'
import { CoverLetterPreview } from '../builder/CoverLetterPreview'
import { SectionCard } from '../SectionCard'
import { Input, Textarea } from '../ui/FormFields'

export function CoverLetterForm({ inline = false }: { inline?: boolean }) {
  const { resume, updateCoverLetter } = useResume()
  const letter = resume.coverLetter
  const [jobText, setJobText] = useState('')

  const fillFromResume = () => {
    const name = resume.personalInfo.fullName || '[Your Name]'
    const company = letter.companyName || '[Company Name]'
    const body = letter.body
      .replace(/\[Your Name\]/g, name)
      .replace(/\[Company Name\]/g, company)

    if (resume.experience[0]?.position && letter.subject.includes('[Position Title]')) {
      updateCoverLetter({
        subject: letter.subject.replace('[Position Title]', resume.experience[0].position),
        body,
      })
    } else {
      updateCoverLetter({ body })
    }
  }

  const generateFromJob = () => {
    if (!jobText.trim()) return
    updateCoverLetter(generateCoverLetterFromJob(resume, jobText))
  }

  const fields = (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center gap-2">
          <Briefcase size={14} className="text-violet-400" />
          <span className="text-xs font-semibold text-slate-400">Generate from job description</span>
        </div>
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          rows={4}
          spellCheck
          placeholder="Paste the job posting here to auto-fill subject and letter body..."
          className="w-full rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-violet-500"
        />
        <button
          type="button"
          onClick={generateFromJob}
          disabled={!jobText.trim()}
          className="mt-2 inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-40"
        >
          <Sparkles size={12} />
          Generate cover letter
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Recipient name"
          value={letter.recipientName}
          onChange={(e) => updateCoverLetter({ recipientName: e.target.value })}
          placeholder="Hiring Manager"
        />
        <Input
          label="Recipient title"
          value={letter.recipientTitle}
          onChange={(e) => updateCoverLetter({ recipientTitle: e.target.value })}
          placeholder="Head of Engineering"
        />
        <Input
          label="Company name"
          value={letter.companyName}
          onChange={(e) => updateCoverLetter({ companyName: e.target.value })}
          placeholder="Acme Corp"
        />
        <Input
          label="Date"
          type="date"
          value={letter.date}
          onChange={(e) => updateCoverLetter({ date: e.target.value })}
        />
      </div>

      <Input
        label="Subject line"
        value={letter.subject}
        onChange={(e) => updateCoverLetter({ subject: e.target.value })}
        placeholder="Application for Senior Software Engineer"
      />

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Letter body</span>
          <button
            type="button"
            onClick={fillFromResume}
            className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
          >
            <Sparkles size={12} />
            Fill from resume
          </button>
        </div>
        <Textarea
          label="Body"
          rows={12}
          value={letter.body}
          onChange={(e) => updateCoverLetter({ body: e.target.value })}
          placeholder="Dear Hiring Manager,..."
        />
      </div>

      <CoverLetterPreview
        letter={letter}
        template={resume.template}
        senderName={resume.personalInfo.fullName}
      />
    </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Cover Letter" icon={<Mail size={16} />}>
      {fields}
    </SectionCard>
  )
}
