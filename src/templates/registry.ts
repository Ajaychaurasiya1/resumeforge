import type { TemplateId } from '../types/resume'

export interface TemplateMeta {
  id: TemplateId
  name: string
  tagline: string
  description: string
  bestFor: string[]
  features: string[]
}

export const TEMPLATE_REGISTRY: TemplateMeta[] = [
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Timeless & professional',
    description:
      'Traditional centered serif layout with clean section dividers. Ideal for corporate, finance, legal, and academic roles.',
    bestFor: ['Corporate', 'Finance', 'Law', 'Academia'],
    features: ['Serif typography', 'Centered header', 'Section rules', 'ATS-safe structure'],
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Bold sidebar layout',
    description:
      'Two-column design with a colored sidebar for contact and skills. Perfect for tech, design, and marketing roles.',
    bestFor: ['Technology', 'Design', 'Marketing', 'Startups'],
    features: ['Accent sidebar', 'Skills highlight', 'Sans-serif body', 'Visual hierarchy'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Clean & contemporary',
    description:
      'Stripped-back design with accent underline and skill tags. Focuses attention on your content.',
    bestFor: ['General', 'Remote', 'Freelance', 'Product'],
    features: ['Minimal header', 'Skill tag pills', 'Accent underline', 'Whitespace'],
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Corporate standard',
    description:
      'Left-aligned header with accent-bordered section titles. The go-to format for business and consulting roles.',
    bestFor: ['Business', 'Consulting', 'Management', 'Operations'],
    features: ['Left-aligned header', 'Accent border sections', 'Clear hierarchy', 'Recruiter-friendly'],
  },
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Senior leadership',
    description:
      'Formal centered layout with double rules and uppercase name styling. Built for directors, VPs, and C-suite.',
    bestFor: ['Executive', 'Director', 'C-Suite', 'Senior Management'],
    features: ['Formal typography', 'Double rule header', 'Uppercase name', 'Authority tone'],
  },
  {
    id: 'compact',
    name: 'Compact',
    tagline: 'Maximum content density',
    description:
      'Tight spacing and inline section labels fit more experience on one page without sacrificing readability.',
    bestFor: ['Experienced', 'Multi-role', 'Academic CV', 'Technical'],
    features: ['Dense layout', 'Inline sections', 'Space efficient', 'One-page friendly'],
  },
  {
    id: 'harvard',
    name: 'Harvard',
    tagline: 'Academic excellence',
    description:
      'Understated academic format with small-caps section headers. Preferred for research, education, and fellowships.',
    bestFor: ['Academia', 'Research', 'PhD', 'Fellowships'],
    features: ['Academic style', 'Small-caps headers', 'Understated design', 'Publication-ready'],
  },
  {
    id: 'chronological',
    name: 'Chronological',
    tagline: 'Timeline-focused',
    description:
      'Dates prominently displayed in a left column emphasizing career progression and timeline clarity.',
    bestFor: ['Career growth', 'Stable history', 'Government', 'Healthcare'],
    features: ['Date column', 'Timeline emphasis', 'Clear progression', 'Linear narrative'],
  },
  {
    id: 'technical',
    name: 'Technical',
    tagline: 'Engineer & developer',
    description:
      'Skills-forward layout with accent bar header and structured sections optimized for engineering roles.',
    bestFor: ['Software', 'Engineering', 'Data Science', 'DevOps'],
    features: ['Skills emphasis', 'Accent bar header', 'Structured sections', 'Tech-optimized'],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    tagline: 'Refined & spacious',
    description:
      'Generous spacing with refined serif headings and subtle dividers. Suited for creative and client-facing roles.',
    bestFor: ['Creative', 'Client-facing', 'Architecture', 'Luxury brands'],
    features: ['Serif elegance', 'Generous spacing', 'Subtle dividers', 'Premium feel'],
  },
]

export const TEMPLATE_IDS = TEMPLATE_REGISTRY.map((t) => t.id)

export function getTemplateMeta(id: TemplateId): TemplateMeta {
  return TEMPLATE_REGISTRY.find((t) => t.id === id) ?? TEMPLATE_REGISTRY[0]
}

export function isValidTemplate(id: string): id is TemplateId {
  return TEMPLATE_IDS.includes(id as TemplateId)
}
