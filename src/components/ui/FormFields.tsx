import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        id={inputId}
        spellCheck
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${className}`}
        {...props}
      />
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: readonly string[]
  placeholder?: string
}

export function Select({ label, id, options, placeholder, className = '', ...props }: SelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        id={inputId}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Textarea({ label, id, className = '', ...props }: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <textarea
        id={inputId}
        spellCheck
        className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${className}`}
        {...props}
      />
    </div>
  )
}
