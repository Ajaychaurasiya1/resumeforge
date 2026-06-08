import type { TemplateId } from '../types/resume'

export type TemplateLayoutKind = 'single' | 'sidebar-left' | 'sidebar-right' | 'split-content'

export type HeaderVariant =
  | 'classic-centered'
  | 'minimal-bar'
  | 'professional-photo'
  | 'executive-rules'
  | 'compact-line'
  | 'harvard-plain'
  | 'chrono-border'
  | 'technical-band'
  | 'elegant-serif'
  | 'europass-blue'
  | 'academic-photo'
  | 'bold-hero'
  | 'corporate-band'
  | 'startup-gradient'
  | 'creative-offset'
  | 'legal-formal'
  | 'metro-inline'
  | 'split-header'
  | 'timeline-minimal'

export type SectionHeadingVariant =
  | 'border-bottom'
  | 'border-left'
  | 'center-flanked'
  | 'compact'
  | 'harvard-caps'
  | 'pill-badge'
  | 'serif-italic'
  | 'accent-track'
  | 'accent-bold'
  | 'blue-box'
  | 'underline-accent'
  | 'ribbon'
  | 'reverse-fill'
  | 'dotted'
  | 'double-line'
  | 'circle-dot'
  | 'gradient-text'
  | 'numbered'
  | 'legal-rule'

export type ExperienceLayout = 'standard' | 'chronological' | 'timeline' | 'classic-inline' | 'card'

export type SkillsLayout = 'category-list' | 'pills-outline' | 'pills-filled' | 'inline-compact'

export interface TemplateTheme {
  layout: TemplateLayoutKind
  header: HeaderVariant
  sectionHeading: SectionHeadingVariant
  experience: ExperienceLayout
  skills: SkillsLayout
  summaryTitle: string
  sectionGap: 'tight' | 'normal' | 'relaxed'
  forceSerif?: boolean
  sidebarSections: ('skills' | 'languages' | 'contact')[]
}

export const TEMPLATE_THEMES: Record<TemplateId, TemplateTheme> = {
  classic: {
    layout: 'single',
    header: 'classic-centered',
    sectionHeading: 'border-bottom',
    experience: 'classic-inline',
    skills: 'category-list',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    forceSerif: true,
    sidebarSections: [],
  },
  modern: {
    layout: 'sidebar-left',
    header: 'classic-centered',
    sectionHeading: 'accent-track',
    experience: 'standard',
    skills: 'category-list',
    summaryTitle: 'Profile',
    sectionGap: 'normal',
    sidebarSections: ['contact', 'skills', 'languages'],
  },
  minimal: {
    layout: 'single',
    header: 'minimal-bar',
    sectionHeading: 'accent-track',
    experience: 'standard',
    skills: 'pills-outline',
    summaryTitle: 'Summary',
    sectionGap: 'relaxed',
    sidebarSections: [],
  },
  professional: {
    layout: 'single',
    header: 'professional-photo',
    sectionHeading: 'border-left',
    experience: 'standard',
    skills: 'category-list',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  executive: {
    layout: 'single',
    header: 'executive-rules',
    sectionHeading: 'center-flanked',
    experience: 'standard',
    skills: 'category-list',
    summaryTitle: 'Executive Summary',
    sectionGap: 'normal',
    forceSerif: true,
    sidebarSections: [],
  },
  compact: {
    layout: 'single',
    header: 'compact-line',
    sectionHeading: 'compact',
    experience: 'standard',
    skills: 'inline-compact',
    summaryTitle: 'Summary',
    sectionGap: 'tight',
    sidebarSections: [],
  },
  harvard: {
    layout: 'single',
    header: 'harvard-plain',
    sectionHeading: 'harvard-caps',
    experience: 'standard',
    skills: 'category-list',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    forceSerif: true,
    sidebarSections: [],
  },
  chronological: {
    layout: 'single',
    header: 'chrono-border',
    sectionHeading: 'accent-bold',
    experience: 'chronological',
    skills: 'category-list',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  technical: {
    layout: 'single',
    header: 'technical-band',
    sectionHeading: 'pill-badge',
    experience: 'standard',
    skills: 'pills-filled',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  elegant: {
    layout: 'single',
    header: 'elegant-serif',
    sectionHeading: 'serif-italic',
    experience: 'standard',
    skills: 'category-list',
    summaryTitle: 'Summary',
    sectionGap: 'relaxed',
    forceSerif: true,
    sidebarSections: [],
  },
  europass: {
    layout: 'single',
    header: 'europass-blue',
    sectionHeading: 'blue-box',
    experience: 'standard',
    skills: 'category-list',
    summaryTitle: 'Personal Statement',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  academic: {
    layout: 'single',
    header: 'academic-photo',
    sectionHeading: 'double-line',
    experience: 'standard',
    skills: 'category-list',
    summaryTitle: 'Research Interests',
    sectionGap: 'normal',
    forceSerif: true,
    sidebarSections: [],
  },
  metro: {
    layout: 'sidebar-right',
    header: 'metro-inline',
    sectionHeading: 'ribbon',
    experience: 'card',
    skills: 'pills-outline',
    summaryTitle: 'About',
    sectionGap: 'normal',
    sidebarSections: ['contact', 'skills', 'languages'],
  },
  bold: {
    layout: 'single',
    header: 'bold-hero',
    sectionHeading: 'reverse-fill',
    experience: 'card',
    skills: 'pills-filled',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  timeline: {
    layout: 'single',
    header: 'timeline-minimal',
    sectionHeading: 'circle-dot',
    experience: 'timeline',
    skills: 'category-list',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  split: {
    layout: 'split-content',
    header: 'split-header',
    sectionHeading: 'dotted',
    experience: 'standard',
    skills: 'pills-outline',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  creative: {
    layout: 'single',
    header: 'creative-offset',
    sectionHeading: 'gradient-text',
    experience: 'card',
    skills: 'pills-filled',
    summaryTitle: 'About Me',
    sectionGap: 'relaxed',
    sidebarSections: [],
  },
  corporate: {
    layout: 'single',
    header: 'corporate-band',
    sectionHeading: 'numbered',
    experience: 'standard',
    skills: 'inline-compact',
    summaryTitle: 'Professional Summary',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  startup: {
    layout: 'single',
    header: 'startup-gradient',
    sectionHeading: 'underline-accent',
    experience: 'standard',
    skills: 'pills-filled',
    summaryTitle: 'Pitch',
    sectionGap: 'normal',
    sidebarSections: [],
  },
  legal: {
    layout: 'single',
    header: 'legal-formal',
    sectionHeading: 'legal-rule',
    experience: 'classic-inline',
    skills: 'category-list',
    summaryTitle: 'Summary',
    sectionGap: 'normal',
    forceSerif: true,
    sidebarSections: [],
  },
}

export function getTemplateTheme(id: TemplateId): TemplateTheme {
  return TEMPLATE_THEMES[id]
}

export const SPLIT_LEFT_SECTIONS = ['summary', 'experience', 'projects'] as const

export function isSidebarTemplate(id: TemplateId): boolean {
  const layout = TEMPLATE_THEMES[id].layout
  return layout === 'sidebar-left' || layout === 'sidebar-right'
}
