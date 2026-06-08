import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Eye,
  FileText,
  FolderGit2,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Mail,
  Mic,
  User,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { SECTION_LABELS, type ResumeData, type SectionId } from '../types/resume'

export type BuilderSection = 'personal' | SectionId | 'custom' | 'coverLetter' | 'preview'

export const BUILDER_NAV_META: Record<
  Exclude<BuilderSection, 'custom'>,
  { label: string; icon: LucideIcon; description: string }
> = {
  personal: {
    label: 'Personal Details',
    icon: User,
    description: 'Your name, email, phone, and contact links.',
  },
  summary: {
    label: 'Summary',
    icon: FileText,
    description: 'A brief professional overview for recruiters.',
  },
  skills: {
    label: 'Skills',
    icon: Zap,
    description: 'Technical and soft skills for your target role.',
  },
  experience: {
    label: 'Experience',
    icon: Briefcase,
    description: 'Work history with roles, companies, and achievements.',
  },
  projects: {
    label: 'Projects',
    icon: FolderGit2,
    description: 'Personal or professional projects worth highlighting.',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    description: 'Degrees, institutions, and academic background.',
  },
  certifications: {
    label: 'Certifications',
    icon: BadgeCheck,
    description: 'Professional certifications, licenses, and credentials.',
  },
  achievements: {
    label: 'Achievements',
    icon: Award,
    description: 'Awards, honors, and notable accomplishments.',
  },
  trainings: {
    label: 'Trainings',
    icon: BookOpen,
    description: 'Courses, bootcamps, and professional training programs.',
  },
  publications: {
    label: 'Publications',
    icon: FileText,
    description: 'Research papers, articles, and published work.',
  },
  workshops: {
    label: 'Workshops',
    icon: Mic,
    description: 'Workshops conducted or attended.',
  },
  references: {
    label: 'References',
    icon: Users,
    description: 'Professional references who can vouch for your work.',
  },
  hobbies: {
    label: 'Hobbies',
    icon: Heart,
    description: 'Interests and activities outside of work.',
  },
  languages: {
    label: 'Languages',
    icon: Languages,
    description: 'Languages you speak and proficiency levels.',
  },
  coverLetter: {
    label: 'Cover Letter',
    icon: Mail,
    description: 'Write a cover letter paired with your resume for applications.',
  },
  preview: {
    label: 'Preview & Download',
    icon: Eye,
    description: 'Review your resume and export when ready.',
  },
}

export const CUSTOM_NAV_META = {
  label: 'Custom Sections',
  icon: Layers,
  description: 'Add your own sections with custom titles and entries.',
}

export function getSectionLabel(id: string, data: ResumeData): string {
  if (id in SECTION_LABELS) return SECTION_LABELS[id as SectionId]
  return data.customSections.find((s) => s.id === id)?.title ?? 'Custom Section'
}

export function getBuilderNavSections(data: ResumeData): BuilderSection[] {
  const core = data.settings.sectionOrder.filter((id): id is SectionId => id in SECTION_LABELS)
  const hasCustom = data.customSections.length > 0
  return ['personal', ...core, ...(hasCustom ? (['custom'] as const) : []), 'preview']
}

export function getOrderedResumeSections(data: ResumeData): string[] {
  return data.settings.sectionOrder.filter((id) => !data.settings.hiddenSections.includes(id))
}
