import { Users, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyReference, type Reference } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input } from '../ui/FormFields'

export function ReferencesForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()

  const updateItem = (id: string, field: keyof Reference, value: string) => {
    setResume((prev) => ({
      ...prev,
      references: prev.references.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({ ...prev, references: [...prev.references, emptyReference()] }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({
      ...prev,
      references: prev.references.filter((item) => item.id !== id),
    }))
  }

  const fields = (
    <div className="space-y-6">
      {resume.references.length === 0 && (
        <p className="text-center text-sm text-slate-500">No references added yet.</p>
      )}
      {resume.references.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Reference #{index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="rounded p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Name" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
            <Input label="Job Title" value={item.title} onChange={(e) => updateItem(item.id, 'title', e.target.value)} />
            <Input label="Company" value={item.company} onChange={(e) => updateItem(item.id, 'company', e.target.value)} />
            <Input label="Relationship" value={item.relationship} onChange={(e) => updateItem(item.id, 'relationship', e.target.value)} placeholder="Manager, Colleague, etc." />
            <Input label="Email" type="email" value={item.email} onChange={(e) => updateItem(item.id, 'email', e.target.value)} />
            <Input label="Phone" value={item.phone} onChange={(e) => updateItem(item.id, 'phone', e.target.value)} />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
      >
        <Plus size={16} />
        Add Reference
      </button>
    </div>
  )

  if (inline) return fields
  return (
    <SectionCard title="References" icon={<Users size={16} />}>
      {fields}
    </SectionCard>
  )
}
