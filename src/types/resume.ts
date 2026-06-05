export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'professional'
  | 'executive'
  | 'compact'
  | 'harvard'
  | 'chronological'
  | 'technical'
  | 'elegant'

export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'certifications'
  | 'languages'

export type AccentColor = 'indigo' | 'blue' | 'emerald' | 'rose' | 'slate'

export type FontSize = 'sm' | 'md' | 'lg'

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
}

export interface Project {
  id: string
  name: string
  url: string
  description: string
  technologies: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url: string
}

export interface Language {
  id: string
  name: string
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic' | ''
}

export interface Achievement {
  id: string
  title: string
  organization: string
  date: string
  description: string
}

export interface ResumeSettings {
  accentColor: AccentColor
  fontSize: FontSize
  sectionOrder: SectionId[]
  hiddenSections: SectionId[]
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  achievements: Achievement[]
  certifications: Certification[]
  languages: Language[]
  template: TemplateId
  settings: ResumeSettings
}

export const SECTION_LABELS: Record<SectionId, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  achievements: 'Achievements',
  certifications: 'Certifications',
  languages: 'Languages',
}

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'achievements',
  'certifications',
  'languages',
]

export const defaultSettings = (): ResumeSettings => ({
  accentColor: 'indigo',
  fontSize: 'md',
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hiddenSections: [],
})

export const emptyPersonalInfo = (): PersonalInfo => ({
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
})

export const emptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
})

export const emptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
})

export const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '',
  url: '',
  description: '',
  technologies: '',
})

export const emptyCertification = (): Certification => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: '',
  url: '',
})

export const emptyLanguage = (): Language => ({
  id: crypto.randomUUID(),
  name: '',
  proficiency: '',
})

export const emptyAchievement = (): Achievement => ({
  id: crypto.randomUUID(),
  title: '',
  organization: '',
  date: '',
  description: '',
})

export const defaultResumeData = (): ResumeData => ({
  personalInfo: emptyPersonalInfo(),
  summary: '',
  experience: [emptyExperience()],
  education: [emptyEducation()],
  skills: [],
  projects: [],
  achievements: [],
  certifications: [],
  languages: [],
  template: 'classic',
  settings: defaultSettings(),
})

export const sampleResumeData = (): ResumeData => ({
  personalInfo: {
    fullName: 'Jane Doe',
    email: 'jane.doe@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.dev',
  },
  summary:
    'Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.',
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description:
        'Led development of a customer-facing dashboard serving 50K+ daily users.\nReduced page load time by 40% through performance optimizations.\nMentored a team of 4 junior engineers.',
    },
    {
      id: crypto.randomUUID(),
      company: 'StartupXYZ',
      position: 'Software Engineer',
      location: 'Remote',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description:
        'Built REST APIs and React frontends for a B2B SaaS platform.\nImplemented CI/CD pipelines reducing deployment time by 60%.',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'University of California',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '3.8',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Git'],
  projects: [
    {
      id: crypto.randomUUID(),
      name: 'Open Source CLI Tool',
      url: 'github.com/janedoe/cli-tool',
      description: 'A developer productivity CLI with 2K+ GitHub stars.',
      technologies: 'TypeScript, Node.js',
    },
  ],
  achievements: [
    {
      id: crypto.randomUUID(),
      title: 'Employee of the Year',
      organization: 'Tech Corp',
      date: '2023-12',
      description: 'Recognized for outstanding leadership and delivery of the customer dashboard project.',
    },
    {
      id: crypto.randomUUID(),
      title: 'Hackathon Winner',
      organization: 'DevCon 2022',
      date: '2022-09',
      description: 'First place among 120 teams for an AI-powered productivity tool.',
    },
  ],
  certifications: [
    {
      id: crypto.randomUUID(),
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      url: '',
    },
  ],
  languages: [
    { id: crypto.randomUUID(), name: 'English', proficiency: 'Native' },
    { id: crypto.randomUUID(), name: 'Spanish', proficiency: 'Intermediate' },
  ],
  template: 'classic',
  settings: defaultSettings(),
})
