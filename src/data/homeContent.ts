import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Briefcase,
  Download,
  Eye,
  FileText,
  Globe,
  Layers,
  Link2,
  Mail,
  Palette,
  QrCode,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Undo2,
  Upload,
  Users,
  Wand2,
  Zap,
} from 'lucide-react'

export const HOME_STATS = [
  { value: '20', label: 'Unique templates' },
  { value: '17', label: 'Builder sections' },
  { value: '100%', label: 'Free forever' },
  { value: '0', label: 'Sign up required' },
]

export const HOME_PILLARS = [
  {
    icon: Shield,
    title: 'Private by design',
    text: 'Your resume stays in your browser. No accounts, no cloud uploads, no data harvesting.',
  },
  {
    icon: Target,
    title: 'Built for ATS',
    text: 'Clean layouts, text based PDF export, keyword matching, and an ATS score checker built in.',
  },
  {
    icon: Zap,
    title: 'Fast to finish',
    text: 'Guided step by step editor, autosave, sample data, and industry packs to start quickly.',
  },
  {
    icon: Globe,
    title: 'Works everywhere',
    text: 'Runs on desktop or tablet. Install as a PWA. Share a read only link or QR code when ready.',
  },
]

export interface HomeFeature {
  icon: LucideIcon
  name: string
  detail: string
}

export interface HomeFeatureGroup {
  title: string
  subtitle: string
  features: HomeFeature[]
}

export const HOME_FEATURE_GROUPS: HomeFeatureGroup[] = [
  {
    title: 'Smart editor',
    subtitle: 'Write faster with guided sections, history, and AI assisted polish.',
    features: [
      { icon: Eye, name: 'Live preview', detail: 'Side by side editing with real time template preview on the Download step.' },
      { icon: Undo2, name: 'Undo & redo', detail: 'Full edit history so you can experiment without losing work.' },
      { icon: RefreshCw, name: 'Autosave', detail: 'Every change saves to your browser automatically with a visible save indicator.' },
      { icon: Wand2, name: 'Smart rewrite', detail: 'Improve bullet points and summaries with phrasing suggestions, not just trimming.' },
      { icon: Sparkles, name: 'Optional AI rewrite', detail: 'Connect your OpenAI key for deeper summary and bullet improvements.' },
      { icon: FileText, name: 'Native spellcheck', detail: 'Built in spell checking on form fields as you type.' },
    ],
  },
  {
    title: 'Personal & skills',
    subtitle: 'Rich contact fields and categorized skills recruiters expect.',
    features: [
      { icon: Users, name: 'Full personal profile', detail: 'Name, role, candidate type (Fresher, Experienced, etc.), phone, email, location.' },
      { icon: Link2, name: 'Clickable links', detail: 'LinkedIn, portfolio, GitHub, and custom URLs with labels, all clickable in preview.' },
      { icon: Layers, name: 'Categorized skills', detail: 'Languages, Frontend, Backend, Database, Tools, fetched from resume or improved with one click.' },
      { icon: Briefcase, name: '17 resume sections', detail: 'Experience, projects, certifications, publications, workshops, references, hobbies, and custom blocks.' },
    ],
  },
  {
    title: 'ATS & job matching',
    subtitle: 'Optimize for the role you want, not just any role.',
    features: [
      { icon: BarChart3, name: 'ATS score checker', detail: 'Free /score page and in builder panel grade contact, summary, skills, and formatting.' },
      { icon: Target, name: 'Job description matcher', detail: 'Paste a job posting to extract keywords and see what you match or miss.' },
      { icon: Sparkles, name: 'One click missing keywords', detail: 'Add suggested skills from the job description into your resume in one tap.' },
      { icon: Eye, name: 'Keyword highlights', detail: 'Preview panel highlights matched terms from your saved job keywords.' },
      { icon: Briefcase, name: 'Industry packs', detail: 'Prebuilt skill and bullet suggestions for software, nursing, marketing, and more.' },
    ],
  },
  {
    title: 'Templates & design',
    subtitle: 'Twenty distinct layouts with visual previews and deep customization.',
    features: [
      { icon: Palette, name: '20 unique templates', detail: 'Classic, Metro, Bold, Timeline, Split, Creative, Corporate, Startup, Legal, and more.' },
      { icon: Layers, name: 'Visual template picker', detail: 'See filled mini previews before switching, not blank thumbnails.' },
      { icon: Palette, name: 'Accent & typography', detail: 'Five accent colors, font family, size, line spacing, section order, and visibility toggles.' },
      { icon: Users, name: 'Photo ready layouts', detail: 'Optional profile photo on Modern, Professional, Elegant, Europass, and Academic templates.' },
    ],
  },
  {
    title: 'Import & export',
    subtitle: 'Get data in quickly and send polished files out.',
    features: [
      { icon: Upload, name: 'Multi format import', detail: 'Paste text, upload PDF or DOCX, or paste LinkedIn profile content to autofill sections.' },
      { icon: Download, name: 'PDF & text PDF', detail: 'Print ready PDF plus ATS friendly text based PDF for strict parsers.' },
      { icon: FileText, name: 'DOCX export', detail: 'Download an editable Word document alongside your PDF.' },
      { icon: Mail, name: 'Cover letter builder', detail: 'Write cover letters manually or generate drafts from a job description.' },
      { icon: Download, name: 'JSON backup', detail: 'Export and import your full resume JSON to move between devices safely.' },
    ],
  },
  {
    title: 'Share & extras',
    subtitle: 'Collaborate, compare versions, and ship with confidence.',
    features: [
      { icon: Link2, name: 'Share read only link', detail: 'Clean /view/your-id URL recruiters can open on any device.' },
      { icon: QrCode, name: 'Resume QR code', detail: 'Generate a QR linking to your portfolio or share page for print materials.' },
      { icon: RefreshCw, name: 'Resume snapshots', detail: 'Save named versions and compare two snapshots side by side.' },
      { icon: Layers, name: 'Multiple resumes', detail: 'Store several resume slots locally for different roles or industries.' },
      { icon: Globe, name: 'PWA install', detail: 'Add ResumeForge to your home screen for quick offline access after first load.' },
    ],
  },
]

export const HOME_STEPS = [
  { step: '01', title: 'Start or import', text: 'Open the builder, paste LinkedIn text, upload PDF/DOCX, or load sample data.' },
  { step: '02', title: 'Fill every section', text: 'Personal details, summary, experience, categorized skills, education, and more.' },
  { step: '03', title: 'Match your target job', text: 'Paste a job description, improve skills, and check your ATS score.' },
  { step: '04', title: 'Pick a template', text: 'Browse 20 distinct layouts with live previews and customize colors and fonts.' },
  { step: '05', title: 'Cover letter & polish', text: 'Generate a cover letter, run smart rewrite, and save snapshots.' },
  { step: '06', title: 'Export & share', text: 'Download PDF, DOCX, or JSON, or share a read only link and QR code.' },
]

export const HOME_SECTIONS = [
  'Personal Info',
  'Summary',
  'Experience',
  'Projects',
  'Achievements',
  'Education',
  'Certifications',
  'Trainings',
  'Publications',
  'Workshops',
  'Skills',
  'Languages',
  'References',
  'Hobbies',
  'Custom Sections',
  'Cover Letter',
]

export const HOME_FAQ = [
  {
    q: 'Is ResumeForge really free?',
    a: 'Yes. Templates, exports, ATS scoring, job matching, and sharing are all free with no premium tier.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Locally in your browser. Nothing is uploaded unless you connect your own OpenAI API key for AI rewrite.',
  },
  {
    q: 'Can I import an existing resume?',
    a: 'Yes. Paste plain text, upload PDF or DOCX, or paste LinkedIn profile sections to autofill fields.',
  },
  {
    q: 'Will my resume pass ATS systems?',
    a: 'Our templates follow ATS safe structure. Run the ATS score tool, text PDF export, and keyword matcher for best results.',
  },
]

export const HOME_TEMPLATE_NAMES = [
  'Classic',
  'Modern',
  'Minimal',
  'Professional',
  'Executive',
  'Compact',
  'Harvard',
  'Chronological',
  'Technical',
  'Elegant',
  'Europass',
  'Academic CV',
  'Metro',
  'Bold',
  'Timeline',
  'Split',
  'Creative',
  'Corporate',
  'Startup',
  'Legal',
]

export const HOME_USE_CASES = [
  {
    title: 'Fresher / Student',
    flow: 'Minimal or Compact template → categorized skills → one-page summary → ATS check',
    templates: ['Minimal', 'Compact', 'Modern'],
  },
  {
    title: 'Experienced professional',
    flow: 'Professional or Chronological → job matcher → snapshots per role → application kit export',
    templates: ['Professional', 'Chronological', 'Corporate'],
  },
  {
    title: 'Career switcher',
    flow: 'Split or Technical layout → smart bullet suggestions → cover letter from JD → track applications',
    templates: ['Split', 'Technical', 'Startup'],
  },
]

export const HOME_HERO_CHECKLIST = [
  'Autosave',
  'Undo/redo',
  'LinkedIn import',
  'Job matcher',
  'QR share link',
]

export const HOME_HERO_INCLUDES = [
  'Categorized skill sections with Improve Skills',
  'ATS score + job description keyword match',
  'PDF, text PDF, DOCX, JSON import/export',
  'Cover letter from job description',
  'Read only share page + QR code',
  'Resume snapshots & version compare',
]
