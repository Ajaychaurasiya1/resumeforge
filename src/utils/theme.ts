import type { AccentColor, FontFamily, FontSize, LineSpacing } from '../types/resume'

export const ACCENT_MAP: Record<
  AccentColor,
  { text: string; textLight: string; bg: string; border: string; sidebarText: string }
> = {
  indigo: {
    text: 'text-indigo-600',
    textLight: 'text-indigo-300',
    bg: 'bg-indigo-600',
    border: 'border-indigo-600',
    sidebarText: 'text-indigo-300',
  },
  blue: {
    text: 'text-blue-600',
    textLight: 'text-blue-300',
    bg: 'bg-blue-600',
    border: 'border-blue-600',
    sidebarText: 'text-blue-300',
  },
  emerald: {
    text: 'text-emerald-600',
    textLight: 'text-emerald-300',
    bg: 'bg-emerald-600',
    border: 'border-emerald-600',
    sidebarText: 'text-emerald-300',
  },
  rose: {
    text: 'text-rose-600',
    textLight: 'text-rose-300',
    bg: 'bg-rose-600',
    border: 'border-rose-600',
    sidebarText: 'text-rose-300',
  },
  slate: {
    text: 'text-slate-700',
    textLight: 'text-slate-300',
    bg: 'bg-slate-700',
    border: 'border-slate-700',
    sidebarText: 'text-slate-300',
  },
}

export const FONT_SIZE_MAP: Record<
  FontSize,
  { body: string; name: string; section: string }
> = {
  sm: { body: 'text-xs', name: 'text-xl', section: 'text-xs' },
  md: { body: 'text-sm', name: 'text-2xl', section: 'text-sm' },
  lg: { body: 'text-base', name: 'text-3xl', section: 'text-base' },
}

export const FONT_FAMILY_MAP: Record<
  FontFamily,
  { className: string; css: string }
> = {
  sans: { className: 'font-sans', css: 'ui-sans-serif, system-ui, sans-serif' },
  serif: { className: 'font-serif', css: 'Merriweather, Georgia, serif' },
  arial: { className: 'font-sans', css: 'Arial, Helvetica, sans-serif' },
  calibri: { className: 'font-sans', css: 'Calibri, Arial, sans-serif' },
  georgia: { className: 'font-serif', css: 'Georgia, Times New Roman, serif' },
}

export const LINE_SPACING_MAP: Record<LineSpacing, string> = {
  tight: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
}

export const ACCENT_SWATCHES: { id: AccentColor; label: string; hex: string }[] = [
  { id: 'indigo', label: 'Indigo', hex: '#4f46e5' },
  { id: 'blue', label: 'Blue', hex: '#2563eb' },
  { id: 'emerald', label: 'Emerald', hex: '#059669' },
  { id: 'rose', label: 'Rose', hex: '#e11d48' },
  { id: 'slate', label: 'Slate', hex: '#334155' },
]
