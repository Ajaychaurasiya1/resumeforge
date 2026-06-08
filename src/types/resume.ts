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
  | 'europass'
  | 'academic'
  | 'metro'
  | 'bold'
  | 'timeline'
  | 'split'
  | 'creative'
  | 'corporate'
  | 'startup'
  | 'legal'

export type FontFamily = 'sans' | 'serif' | 'arial' | 'calibri' | 'georgia'

export type LineSpacing = 'tight' | 'normal' | 'relaxed'

export type TemplateCategory =
  | 'ats'
  | 'creative'
  | 'academic'
  | 'one-column'
  | 'two-column'
  | 'split-column'
  | 'executive'
  | 'technical'

export type TemplateLayout = 'one-column' | 'two-column' | 'split-column'

export type SectionId =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'achievements'
  | 'trainings'
  | 'publications'
  | 'workshops'
  | 'references'
  | 'hobbies'
  | 'languages'

export type AccentColor = 'indigo' | 'blue' | 'emerald' | 'rose' | 'slate'

export type FontSize = 'sm' | 'md' | 'lg'

export const CANDIDATE_TYPES = [
  'Fresher',
  'Experienced',
  'Student',
  'Intern',
  'Career Switcher',
] as const

export type CandidateType = (typeof CANDIDATE_TYPES)[number] | ''

export interface CustomUrl {
  id: string
  label: string
  url: string
}

export interface PersonalInfo {
  fullName: string
  phone: string
  email: string
  role: string
  candidateType: CandidateType
  location: string
  linkedin: string
  linkedinLabel: string
  portfolio: string
  portfolioLabel: string
  github: string
  githubLabel: string
  customUrls: CustomUrl[]
  photoUrl: string
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

/** Shared shape for trainings, publications, workshops, custom items */
export interface ResumeEntry {
  id: string
  title: string
  subtitle: string
  date: string
  location: string
  description: string
  url: string
}

export type Training = ResumeEntry
export type Publication = ResumeEntry
export type Workshop = ResumeEntry

export interface Reference {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  relationship: string
}

export interface Hobby {
  id: string
  name: string
  description: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: string
}

export interface CustomSection {
  id: string
  title: string
  items: ResumeEntry[]
}

export interface ResumeSettings {
  accentColor: AccentColor
  fontSize: FontSize
  fontFamily: FontFamily
  lineSpacing: LineSpacing
  sectionOrder: string[]
  hiddenSections: string[]
}

export interface SavedResumeSlot {
  id: string
  name: string
  updatedAt: string
  data: ResumeData
}

export interface CoverLetterData {
  recipientName: string
  recipientTitle: string
  companyName: string
  date: string
  subject: string
  body: string
}

export interface ResumeSnapshot {
  id: string
  name: string
  createdAt: string
  data: ResumeData
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  coverLetter: CoverLetterData
  experience: Experience[]
  education: Education[]
  skillCategories: SkillCategory[]
  projects: Project[]
  achievements: Achievement[]
  certifications: Certification[]
  trainings: Training[]
  publications: Publication[]
  workshops: Workshop[]
  references: Reference[]
  hobbies: Hobby[]
  customSections: CustomSection[]
  languages: Language[]
  template: TemplateId
  settings: ResumeSettings
}

export const SECTION_LABELS: Record<SectionId, string> = {
  summary: 'Summary',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  achievements: 'Achievements',
  trainings: 'Trainings',
  publications: 'Publications',
  workshops: 'Workshops',
  references: 'References',
  hobbies: 'Hobbies',
  languages: 'Languages',
}

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'summary',
  'skills',
  'experience',
  'projects',
  'education',
  'certifications',
  'achievements',
  'trainings',
  'publications',
  'workshops',
  'references',
  'hobbies',
]

export const CORE_SECTION_IDS: SectionId[] = [...DEFAULT_SECTION_ORDER, 'languages']

export function isCoreSectionId(id: string): id is SectionId {
  return Object.prototype.hasOwnProperty.call(SECTION_LABELS, id)
}

export const defaultSettings = (): ResumeSettings => ({
  accentColor: 'indigo',
  fontSize: 'md',
  fontFamily: 'sans',
  lineSpacing: 'normal',
  sectionOrder: [...DEFAULT_SECTION_ORDER, 'languages'],
  hiddenSections: ['languages'],
})

export const emptySkillCategory = (name: string): SkillCategory => ({
  id: crypto.randomUUID(),
  name,
  skills: '',
})

export const defaultSkillCategories = (): SkillCategory[] => [
  emptySkillCategory('Languages'),
  emptySkillCategory('Frontend Development'),
  emptySkillCategory('Backend Development'),
  emptySkillCategory('Database Management'),
  emptySkillCategory('Tools & Software'),
]

export const emptyCustomUrl = (): CustomUrl => ({
  id: crypto.randomUUID(),
  label: '',
  url: '',
})

export const emptyPersonalInfo = (): PersonalInfo => ({
  fullName: '',
  phone: '',
  email: '',
  role: '',
  candidateType: 'Fresher',
  location: '',
  linkedin: '',
  linkedinLabel: '',
  portfolio: '',
  portfolioLabel: '',
  github: '',
  githubLabel: '',
  customUrls: [],
  photoUrl: '',
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

export const emptyResumeEntry = (): ResumeEntry => ({
  id: crypto.randomUUID(),
  title: '',
  subtitle: '',
  date: '',
  location: '',
  description: '',
  url: '',
})

export const emptyReference = (): Reference => ({
  id: crypto.randomUUID(),
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  relationship: '',
})

export const emptyHobby = (): Hobby => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
})

export const emptyCustomSection = (title = 'Custom Section'): CustomSection => ({
  id: crypto.randomUUID(),
  title,
  items: [],
})

export const emptyCoverLetter = (): CoverLetterData => ({
  recipientName: '',
  recipientTitle: '',
  companyName: '',
  date: new Date().toISOString().slice(0, 10),
  subject: '',
  body: '',
})

export const defaultCoverLetter = (): CoverLetterData => ({
  recipientName: 'Hiring Manager',
  recipientTitle: '',
  companyName: '',
  date: new Date().toISOString().slice(0, 10),
  subject: 'Application for [Position Title]',
  body: `Dear Hiring Manager,

I am writing to express my interest in the [Position Title] role at [Company Name]. With my background in [your field], I am confident I can contribute meaningfully to your team.

In my recent role, I [highlight one key achievement with a metric]. I am particularly drawn to [Company Name] because of [specific reason].

Thank you for considering my application. I look forward to discussing how my experience aligns with your needs.

Sincerely,
[Your Name]`,
})

export const defaultResumeData = (): ResumeData => ({
  personalInfo: emptyPersonalInfo(),
  summary: '',
  coverLetter: emptyCoverLetter(),
  experience: [emptyExperience()],
  education: [emptyEducation()],
  skillCategories: defaultSkillCategories(),
  projects: [],
  achievements: [],
  certifications: [],
  trainings: [],
  publications: [],
  workshops: [],
  references: [],
  hobbies: [],
  customSections: [],
  languages: [],
  template: 'classic',
  settings: defaultSettings(),
})

export const sampleResumeData = (): ResumeData => ({
  personalInfo: {
    fullName: 'Jane Doe',
    phone: '(555) 123-4567',
    email: 'jane.doe@email.com',
    role: 'Senior Software Engineer',
    candidateType: 'Experienced',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/janedoe',
    linkedinLabel: 'LinkedIn',
    portfolio: 'https://janedoe.dev',
    portfolioLabel: 'Portfolio',
    github: 'https://github.com/janedoe',
    githubLabel: 'GitHub',
    customUrls: [],
    photoUrl: '',
  },
  summary:
    'Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.',
  coverLetter: defaultCoverLetter(),
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
  skillCategories: [
    {
      id: crypto.randomUUID(),
      name: 'Languages',
      skills: 'JavaScript (ES6+), C, C++',
    },
    {
      id: crypto.randomUUID(),
      name: 'Frontend Development',
      skills: 'React.js, Next.js, HTML5, CSS3, Tailwind CSS, Bootstrap',
    },
    {
      id: crypto.randomUUID(),
      name: 'Backend Development',
      skills: 'Node.js, Express.js, REST APIs',
    },
    {
      id: crypto.randomUUID(),
      name: 'Database Management',
      skills: 'MySQL, MongoDB',
    },
    {
      id: crypto.randomUUID(),
      name: 'Tools & Software',
      skills: 'Git, GitHub, Postman, VS Code, Docker, Digital Ocean',
    },
  ],
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
  trainings: [
    {
      id: crypto.randomUUID(),
      title: 'Advanced React Patterns',
      subtitle: 'Frontend Masters',
      date: '2022-08',
      location: 'Online',
      description: 'Deep dive into composition, performance, and state management.',
      url: '',
    },
  ],
  publications: [],
  workshops: [],
  references: [],
  hobbies: [{ id: crypto.randomUUID(), name: 'Open Source', description: 'Contributing to developer tools on GitHub.' }],
  customSections: [],
  languages: [
    { id: crypto.randomUUID(), name: 'English', proficiency: 'Native' },
    { id: crypto.randomUUID(), name: 'Spanish', proficiency: 'Intermediate' },
  ],
  template: 'classic',
  settings: defaultSettings(),
})
