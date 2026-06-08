import type { ResumeData } from '../types/resume'
import { mergeSkillsIntoCategories } from './skills'

export type IndustryPackId = 'swe' | 'pm' | 'data' | 'nursing' | 'marketing' | 'design'

export interface IndustryPack {
  id: IndustryPackId
  name: string
  description: string
  skills: string[]
  summaryHint: string
  experienceBullets: string[]
}

export const INDUSTRY_PACKS: IndustryPack[] = [
  {
    id: 'swe',
    name: 'Software Engineer',
    description: 'Full-stack / backend focused skills and impact bullets.',
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'PostgreSQL',
      'Git',
      'CI/CD',
    ],
    summaryHint:
      'Software engineer with experience building scalable web applications, APIs, and cloud-native systems.',
    experienceBullets: [
      'Developed and shipped features used by 10K+ monthly active users',
      'Reduced API latency by 35% through query optimization and caching',
      'Led code reviews and mentored junior developers on best practices',
    ],
  },
  {
    id: 'pm',
    name: 'Product Manager',
    description: 'Roadmaps, stakeholders, and product delivery language.',
    skills: [
      'Product Strategy',
      'Roadmapping',
      'Agile',
      'Scrum',
      'User Research',
      'A/B Testing',
      'SQL',
      'Jira',
      'Stakeholder Management',
      'Go-to-Market',
    ],
    summaryHint:
      'Product manager with a track record of launching user-centric products and aligning cross-functional teams.',
    experienceBullets: [
      'Defined product roadmap prioritizing features that increased retention by 18%',
      'Partnered with engineering and design to deliver MVP in 8 weeks',
      'Conducted user interviews and synthesized insights into actionable requirements',
    ],
  },
  {
    id: 'data',
    name: 'Data Scientist',
    description: 'ML, analytics, and experimentation skills.',
    skills: [
      'Python',
      'SQL',
      'Pandas',
      'Scikit-learn',
      'TensorFlow',
      'Statistics',
      'A/B Testing',
      'Tableau',
      'Spark',
      'ETL',
    ],
    summaryHint:
      'Data scientist experienced in predictive modeling, experimentation, and translating data into business decisions.',
    experienceBullets: [
      'Built classification model improving forecast accuracy by 22%',
      'Automated reporting pipelines saving 15 hours per week',
      'Presented insights to leadership driving a $500K investment decision',
    ],
  },
  {
    id: 'nursing',
    name: 'Registered Nurse',
    description: 'Clinical care, compliance, and patient outcomes.',
    skills: [
      'Patient Assessment',
      'IV Therapy',
      'Medication Administration',
      'Electronic Health Records',
      'BLS',
      'ACLS',
      'Care Planning',
      'Infection Control',
      'Patient Education',
      'Team Collaboration',
    ],
    summaryHint:
      'Compassionate registered nurse with experience in acute care, patient advocacy, and interdisciplinary collaboration.',
    experienceBullets: [
      'Managed care for 5–6 patients per shift while maintaining 98% documentation compliance',
      'Educated patients and families on post-discharge care reducing readmissions',
      'Collaborated with physicians and specialists to implement individualized care plans',
    ],
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    description: 'Campaigns, SEO, and growth metrics.',
    skills: [
      'SEO',
      'Google Analytics',
      'Content Strategy',
      'Email Marketing',
      'Social Media',
      'PPC',
      'HubSpot',
      'Copywriting',
      'CRM',
      'Conversion Optimization',
    ],
    summaryHint:
      'Digital marketer skilled in demand generation, content strategy, and data-driven campaign optimization.',
    experienceBullets: [
      'Increased organic traffic by 45% through SEO and content initiatives',
      'Managed paid campaigns with 3.2x ROAS across search and social',
      'Launched email nurture flows improving lead-to-customer conversion by 12%',
    ],
  },
  {
    id: 'design',
    name: 'UX / Product Design',
    description: 'Research, systems, and visual design.',
    skills: [
      'Figma',
      'User Research',
      'Wireframing',
      'Prototyping',
      'Design Systems',
      'Usability Testing',
      'HTML',
      'CSS',
      'Accessibility',
      'Interaction Design',
    ],
    summaryHint:
      'Product designer focused on user research, accessible interfaces, and design systems that scale.',
    experienceBullets: [
      'Redesigned onboarding flow increasing activation by 28%',
      'Created component library adopted across 3 product squads',
      'Ran usability tests and iterated on flows based on qualitative feedback',
    ],
  },
]

export function applyIndustryPack(data: ResumeData, packId: IndustryPackId): ResumeData {
  const pack = INDUSTRY_PACKS.find((p) => p.id === packId)
  if (!pack) return data

  const summary =
    data.summary.trim().length < 30 ? pack.summaryHint : data.summary

  const experience = data.experience.map((exp, idx) => {
    if (idx !== 0) return exp
    const hasBullets = exp.description.split('\n').filter((l) => l.trim()).length >= 2
    if (hasBullets) return exp
    return {
      ...exp,
      description: pack.experienceBullets.join('\n'),
    }
  })

  return {
    ...data,
    skillCategories: mergeSkillsIntoCategories(data.skillCategories, pack.skills),
    summary,
    experience,
  }
}
