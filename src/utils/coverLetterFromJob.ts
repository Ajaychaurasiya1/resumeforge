import type { CoverLetterData, ResumeData } from '../types/resume'
import { getFlatSkills } from './skills'
import { extractKeywords } from './jobMatcher'

function extractJobTitle(jobText: string): string {
  const lines = jobText.split('\n').map((l) => l.trim()).filter(Boolean)
  for (const line of lines.slice(0, 8)) {
    if (/^(?:job title|position|role)\s*:/i.test(line)) {
      return line.replace(/^[^:]+:\s*/, '').trim()
    }
    if (line.length < 80 && /engineer|manager|developer|designer|analyst|nurse|specialist/i.test(line)) {
      return line.replace(/^[-•*]\s*/, '')
    }
  }
  const match = jobText.match(
    /\b((?:senior|lead|staff|junior)?\s*[\w\s/-]{3,40}(?:engineer|developer|manager|designer|analyst|nurse|specialist|coordinator|director))\b/i,
  )
  return match?.[1]?.trim() ?? 'the open position'
}

function extractCompany(jobText: string): string {
  const match = jobText.match(/(?:at|@|company:?)\s+([A-Z][\w\s&.,'-]{2,40})/i)
  if (match) return match[1].trim()
  const lines = jobText.split('\n').slice(0, 5)
  for (const line of lines) {
    if (/inc\.|llc|corp|ltd|company/i.test(line) && line.length < 60) return line.trim()
  }
  return ''
}

export function generateCoverLetterFromJob(
  resume: ResumeData,
  jobText: string,
): Partial<CoverLetterData> {
  const title = extractJobTitle(jobText)
  const company = extractCompany(jobText) || resume.coverLetter.companyName || '[Company Name]'
  const name = resume.personalInfo.fullName || '[Your Name]'
  const keywords = extractKeywords(jobText).slice(0, 5)
  const skillLine = keywords.length
    ? keywords.join(', ')
    : getFlatSkills(resume.skillCategories).slice(0, 5).join(', ')

  const topRole = resume.experience.find((e) => e.position)?.position
  const topAchievement =
    resume.experience[0]?.description.split('\n').find((l) => l.trim()) ??
    resume.summary.split('.').find((s) => s.trim()) ??
    'delivering strong results in my previous roles'

  const subject = `Application for ${title}${company && company !== '[Company Name]' ? ` at ${company}` : ''}`

  const body = `Dear Hiring Manager,

I am writing to express my interest in the ${title} role${company ? ` at ${company}` : ''}. ${topRole ? `As a ${topRole}, I` : 'I'} have built experience aligned with your requirements, including ${skillLine}.

In my recent work, I ${topAchievement.replace(/^[•\-*]\s*/, '').replace(/\.$/, '')}. I am confident I can contribute to your team from day one and would welcome the opportunity to discuss how my background fits your needs.

Thank you for your time and consideration.

Sincerely,
${name}`

  return {
    recipientName: 'Hiring Manager',
    companyName: company,
    subject,
    body,
    date: new Date().toISOString().slice(0, 10),
  }
}
