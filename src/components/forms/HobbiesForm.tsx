import { Heart, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyHobby, type Hobby } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input, Textarea } from '../ui/FormFields'

export function HobbiesForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()

  const updateItem = (id: string, field: keyof Hobby, value: string) => {
    setResume((prev) => ({
      ...prev,
      hobbies: prev.hobbies.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({ ...prev, hobbies: [...prev.hobbies, emptyHobby()] }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({ ...prev, hobbies: prev.hobbies.filter((item) => item.id !== id) }))
  }

  const fields = (
    <div className="space-y-6">
      {resume.hobbies.length === 0 && (
        <p className="text-center text-sm text-slate-500">No hobbies added yet.</p>
      )}
      {resume.hobbies.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hobby #{index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="rounded p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid gap-3">
            <Input label="Hobby" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="Photography, Chess, Hiking..." />
            <Textarea label="Description (optional)" rows={2} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
      >
        <Plus size={16} />
        Add Hobby
      </button>
    </div>
  )

  if (inline) return fields
  return (
    <SectionCard title="Hobbies" icon={<Heart size={16} />}>
      {fields}
    </SectionCard>
  )
}
