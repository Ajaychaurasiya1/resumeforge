import type { TemplateCategory, TemplateId, TemplateLayout } from '../types/resume'

export interface TemplateMeta {
  id: TemplateId
  name: string
  tagline: string
  description: string
  bestFor: string[]
  features: string[]
  categories: TemplateCategory[]
  layout: TemplateLayout
  atsOptimized: boolean
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
    categories: ['ats', 'one-column', 'executive'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Bold sidebar layout',
    description:
      'Two-column design with a colored sidebar for contact and skills. Perfect for tech, design, and marketing roles.',
    bestFor: ['Technology', 'Design', 'Marketing', 'Startups'],
    features: ['Accent sidebar', 'Skills highlight', 'Sans-serif body', 'Visual hierarchy'],
    categories: ['creative', 'two-column', 'technical'],
    layout: 'two-column',
    atsOptimized: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Clean & contemporary',
    description:
      'Stripped-back design with accent underline and skill tags. Focuses attention on your content.',
    bestFor: ['General', 'Remote', 'Freelance', 'Product'],
    features: ['Minimal header', 'Skill tag pills', 'Accent underline', 'Whitespace'],
    categories: ['ats', 'one-column', 'creative'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Corporate standard',
    description:
      'Left-aligned header with accent-bordered section titles. The go-to format for business and consulting roles.',
    bestFor: ['Business', 'Consulting', 'Management', 'Operations'],
    features: ['Left-aligned header', 'Accent border sections', 'Clear hierarchy', 'Recruiter-friendly'],
    categories: ['ats', 'one-column', 'executive'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Senior leadership',
    description:
      'Formal centered layout with double rules and uppercase name styling. Built for directors, VPs, and C-suite.',
    bestFor: ['Executive', 'Director', 'C-Suite', 'Senior Management'],
    features: ['Formal typography', 'Double rule header', 'Uppercase name', 'Authority tone'],
    categories: ['executive', 'one-column', 'ats'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'compact',
    name: 'Compact',
    tagline: 'Maximum content density',
    description:
      'Tight spacing and inline section labels fit more experience on one page without sacrificing readability.',
    bestFor: ['Experienced', 'Multi-role', 'Academic CV', 'Technical'],
    features: ['Dense layout', 'Inline sections', 'Space efficient', 'One-page friendly'],
    categories: ['ats', 'one-column', 'technical'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'harvard',
    name: 'Harvard',
    tagline: 'Academic excellence',
    description:
      'Understated academic format with small-caps section headers. Preferred for research, education, and fellowships.',
    bestFor: ['Academia', 'Research', 'PhD', 'Fellowships'],
    features: ['Academic style', 'Small-caps headers', 'Understated design', 'Publication-ready'],
    categories: ['academic', 'one-column', 'ats'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'chronological',
    name: 'Chronological',
    tagline: 'Timeline-focused',
    description:
      'Dates prominently displayed in a left column emphasizing career progression and timeline clarity.',
    bestFor: ['Career growth', 'Stable history', 'Government', 'Healthcare'],
    features: ['Date column', 'Timeline emphasis', 'Clear progression', 'Linear narrative'],
    categories: ['ats', 'one-column'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'technical',
    name: 'Technical',
    tagline: 'Engineer & developer',
    description:
      'Skills-forward layout with accent bar header and structured sections optimized for engineering roles.',
    bestFor: ['Software', 'Engineering', 'Data Science', 'DevOps'],
    features: ['Skills emphasis', 'Accent bar header', 'Structured sections', 'Tech-optimized'],
    categories: ['technical', 'one-column', 'ats'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    tagline: 'Refined & spacious',
    description:
      'Generous spacing with refined serif headings and subtle dividers. Suited for creative and client-facing roles.',
    bestFor: ['Creative', 'Client-facing', 'Architecture', 'Luxury brands'],
    features: ['Serif elegance', 'Generous spacing', 'Subtle dividers', 'Premium feel'],
    categories: ['creative', 'one-column'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'europass',
    name: 'Europass',
    tagline: 'EU standard format',
    description:
      'Structured layout inspired by the Europass CV standard — clear sections, photo-ready header, and recruiter-friendly hierarchy.',
    bestFor: ['Europe', 'International', 'Public sector', 'Education'],
    features: ['EU-style sections', 'Photo support', 'Structured layout', 'Multilingual-ready'],
    categories: ['ats', 'one-column', 'academic'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'academic',
    name: 'Academic CV',
    tagline: 'Research & publications',
    description:
      'Extended academic format emphasizing publications, research, and credentials. Ideal for faculty and PhD applications.',
    bestFor: ['Faculty', 'Research', 'Postdoc', 'Grant applications'],
    features: ['Publication focus', 'Academic hierarchy', 'Credentials emphasis', 'CV-length friendly'],
    categories: ['academic', 'one-column'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'metro',
    name: 'Metro',
    tagline: 'Right sidebar layout',
    description:
      'Content-first layout with a right accent rail for contact and skills. Distinct from Modern with ribbon section titles and card-style experience.',
    bestFor: ['Product', 'UX', 'Consulting', 'Operations'],
    features: ['Right sidebar', 'Ribbon headings', 'Card experience', 'Clean main column'],
    categories: ['creative', 'two-column', 'technical'],
    layout: 'two-column',
    atsOptimized: true,
  },
  {
    id: 'bold',
    name: 'Bold',
    tagline: 'Hero header impact',
    description:
      'Large accent hero block with reverse-fill section titles and filled skill pills. Built to stand out in creative and leadership roles.',
    bestFor: ['Leadership', 'Creative Director', 'Brand', 'Sales'],
    features: ['Hero header', 'Reverse-fill sections', 'Filled skill pills', 'High contrast'],
    categories: ['creative', 'executive', 'one-column'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    tagline: 'Visual career path',
    description:
      'Vertical timeline for experience with dot-accent section headings. Shows career progression at a glance.',
    bestFor: ['Career growth', 'Project roles', 'Consulting', 'Healthcare'],
    features: ['Timeline experience', 'Dot headings', 'Date emphasis', 'Progression focus'],
    categories: ['ats', 'one-column'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'split',
    name: 'Split',
    tagline: 'Two-column content',
    description:
      'Experience and projects on the left, education and skills on the right. Maximizes scanability for technical profiles.',
    bestFor: ['Software', 'Engineering', 'Data', 'Multi-skill roles'],
    features: ['Split content columns', 'Dual header row', 'Dotted section titles', 'Balanced layout'],
    categories: ['technical', 'two-column', 'split-column', 'ats'],
    layout: 'split-column',
    atsOptimized: true,
  },
  {
    id: 'creative',
    name: 'Creative',
    tagline: 'Designer portfolio feel',
    description:
      'Offset accent block header with gradient section titles and card-style entries. For designers, marketers, and creatives.',
    bestFor: ['Design', 'Marketing', 'Media', 'Advertising'],
    features: ['Offset header block', 'Gradient headings', 'Card entries', 'Portfolio tone'],
    categories: ['creative', 'one-column'],
    layout: 'one-column',
    atsOptimized: false,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    tagline: 'Fortune 500 polish',
    description:
      'Dark corporate band header with numbered section titles and compact inline skills. Trusted format for enterprise roles.',
    bestFor: ['Enterprise', 'Finance', 'Banking', 'Insurance'],
    features: ['Corporate band header', 'Numbered sections', 'Compact skills', 'Enterprise tone'],
    categories: ['executive', 'one-column', 'ats'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'startup',
    name: 'Startup',
    tagline: 'Modern & energetic',
    description:
      'Gradient header with underline-accent sections and filled skill tags. Perfect for startups, product, and growth teams.',
    bestFor: ['Startups', 'Product', 'Growth', 'SaaS'],
    features: ['Gradient header', 'Underline sections', 'Skill tags', 'Energetic tone'],
    categories: ['creative', 'technical', 'one-column'],
    layout: 'one-column',
    atsOptimized: true,
  },
  {
    id: 'legal',
    name: 'Legal',
    tagline: 'Traditional formal',
    description:
      'Formal ruled header and legal-style section dividers with inline experience formatting. Suited for law, compliance, and policy.',
    bestFor: ['Law', 'Compliance', 'Policy', 'Government'],
    features: ['Formal ruled header', 'Legal section rules', 'Inline experience', 'Serif typography'],
    categories: ['executive', 'one-column', 'ats'],
    layout: 'one-column',
    atsOptimized: true,
  },
]

export const TEMPLATE_IDS = TEMPLATE_REGISTRY.map((t) => t.id)

export const TEMPLATE_FILTER_OPTIONS: { id: TemplateCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All templates' },
  { id: 'ats', label: 'ATS-optimized' },
  { id: 'one-column', label: 'One column' },
  { id: 'two-column', label: 'Two column' },
  { id: 'split-column', label: 'Split column' },
  { id: 'academic', label: 'Academic' },
  { id: 'creative', label: 'Creative' },
  { id: 'executive', label: 'Executive' },
  { id: 'technical', label: 'Technical' },
]

export function getTemplateMeta(id: TemplateId): TemplateMeta {
  return TEMPLATE_REGISTRY.find((t) => t.id === id) ?? TEMPLATE_REGISTRY[0]
}

export function isValidTemplate(id: string): id is TemplateId {
  return TEMPLATE_IDS.includes(id as TemplateId)
}

export function filterTemplates(category: TemplateCategory | 'all'): TemplateMeta[] {
  if (category === 'all') return TEMPLATE_REGISTRY
  return TEMPLATE_REGISTRY.filter((t) => t.categories.includes(category))
}
