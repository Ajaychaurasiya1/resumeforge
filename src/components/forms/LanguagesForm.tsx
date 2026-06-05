import { Globe, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyLanguage, type Language } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input } from '../ui/FormFields'

const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'] as const

export function LanguagesForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()

  const updateItem = (id: string, field: keyof Language, value: string) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({
      ...prev,
      languages: [...prev.languages, emptyLanguage()],
    }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.filter((item) => item.id !== id),
    }))
  }

  const fields = (
      <div className="space-y-6">
        {resume.languages.length === 0 && (
          <p className="text-center text-sm text-slate-500">No languages added yet.</p>
        )}
        {resume.languages.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Language #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Language"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder="English"
              />
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Proficiency
                </label>
                <select
                  value={item.proficiency}
                  onChange={(e) => updateItem(item.id, 'proficiency', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select level</option>
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
        >
          <Plus size={16} />
          Add Language
        </button>
      </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Languages" icon={<Globe size={16} />} defaultOpen={false}>
      {fields}
    </SectionCard>
  )
}
