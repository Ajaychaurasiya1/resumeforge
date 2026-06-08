import { Layers, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyResumeEntry, type CustomSection, type ResumeEntry } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input, Textarea } from '../ui/FormFields'

export function CustomSectionsForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume, addCustomSection, removeCustomSection } = useResume()

  const updateSectionTitle = (id: string, title: string) => {
    setResume((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) => (s.id === id ? { ...s, title } : s)),
    }))
  }

  const updateItem = (sectionId: string, itemId: string, field: keyof ResumeEntry, value: string) => {
    setResume((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : section,
      ),
    }))
  }

  const addItem = (sectionId: string) => {
    setResume((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, emptyResumeEntry()] }
          : section,
      ),
    }))
  }

  const removeItem = (sectionId: string, itemId: string) => {
    setResume((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
          : section,
      ),
    }))
  }

  const renderSection = (section: CustomSection, index: number) => (
    <div key={section.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <Input
            label="Section title"
            value={section.title}
            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            placeholder={`Custom Section ${index + 1}`}
          />
        </div>
        <button
          type="button"
          onClick={() => removeCustomSection(section.id)}
          className="mt-5 rounded p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          title="Remove entire section"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {section.items.map((item, itemIndex) => (
          <div key={item.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">Entry #{itemIndex + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(section.id, item.id)}
                className="rounded p-1 text-slate-400 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Title" value={item.title} onChange={(e) => updateItem(section.id, item.id, 'title', e.target.value)} />
              <Input label="Subtitle" value={item.subtitle} onChange={(e) => updateItem(section.id, item.id, 'subtitle', e.target.value)} />
              <Input label="Date" type="month" value={item.date} onChange={(e) => updateItem(section.id, item.id, 'date', e.target.value)} />
              <Input label="Location" value={item.location} onChange={(e) => updateItem(section.id, item.id, 'location', e.target.value)} />
              <div className="sm:col-span-2">
                <Textarea label="Description" rows={2} value={item.description} onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => addItem(section.id)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2 text-sm text-slate-500 transition hover:border-violet-500/40 hover:text-violet-400"
      >
        <Plus size={14} />
        Add entry
      </button>
    </div>
  )

  const fields = (
    <div className="space-y-6">
      {resume.customSections.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          Create custom sections for anything not covered above.
        </p>
      )}
      {resume.customSections.map(renderSection)}
      <button
        type="button"
        onClick={() => addCustomSection()}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-violet-500/30 bg-violet-500/5 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10"
      >
        <Plus size={16} />
        Add Custom Section
      </button>
    </div>
  )

  if (inline) return fields
  return (
    <SectionCard title="Custom Sections" icon={<Layers size={16} />}>
      {fields}
    </SectionCard>
  )
}
