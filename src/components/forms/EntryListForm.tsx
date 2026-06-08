import { Plus, Trash2, Copy } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyResumeEntry, type ResumeEntry } from '../../types/resume'
import { cloneWithNewId } from '../../utils/duplicateEntry'
import { Input, Textarea } from '../ui/FormFields'
import { FormLinkPreview } from '../templates/ResumeLinks'

interface FieldLabels {
  title: string
  subtitle: string
  date: string
  location: string
  description: string
  url: string
  addButton: string
  itemLabel: string
}

interface Props {
  field: 'trainings' | 'publications' | 'workshops'
  labels: FieldLabels
  showLocation?: boolean
  showUrl?: boolean
}

export function EntryListForm({ field, labels, showLocation = true, showUrl = true }: Props) {
  const { resume, setResume } = useResume()
  const items = resume[field]

  const updateItem = (id: string, key: keyof ResumeEntry, value: string) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({ ...prev, [field]: [...prev[field], emptyResumeEntry()] }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({ ...prev, [field]: prev[field].filter((item) => item.id !== id) }))
  }

  const duplicateItem = (id: string) => {
    setResume((prev) => {
      const item = prev[field].find((e) => e.id === id)
      if (!item) return prev
      const copy = cloneWithNewId(item)
      const idx = prev[field].findIndex((e) => e.id === id)
      const next = [...prev[field]]
      next.splice(idx + 1, 0, copy)
      return { ...prev, [field]: next }
    })
  }

  return (
    <div className="space-y-6">
      {items.length === 0 && (
        <p className="text-center text-sm text-slate-500">No entries yet. Add one below.</p>
      )}
      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {labels.itemLabel} #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => duplicateItem(item.id)}
              className="rounded p-1 text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-400"
              title="Duplicate"
            >
              <Copy size={14} />
            </button>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="rounded p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label={labels.title}
              value={item.title}
              onChange={(e) => updateItem(item.id, 'title', e.target.value)}
            />
            <Input
              label={labels.subtitle}
              value={item.subtitle}
              onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)}
            />
            <Input
              label={labels.date}
              type="month"
              value={item.date}
              onChange={(e) => updateItem(item.id, 'date', e.target.value)}
            />
            {showLocation && (
              <Input
                label={labels.location}
                value={item.location}
                onChange={(e) => updateItem(item.id, 'location', e.target.value)}
              />
            )}
            {showUrl && (
              <div className="sm:col-span-2">
                <Input
                  label={labels.url}
                  value={item.url}
                  onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                />
                <FormLinkPreview value={item.url} />
              </div>
            )}
            <div className="sm:col-span-2">
              <Textarea
                label={labels.description}
                rows={3}
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              />
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
        {labels.addButton}
      </button>
    </div>
  )
}
