import { Award, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyAchievement, type Achievement } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input, Textarea } from '../ui/FormFields'

export function AchievementsForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()

  const updateItem = (id: string, field: keyof Achievement, value: string) => {
    setResume((prev) => ({
      ...prev,
      achievements: prev.achievements.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({
      ...prev,
      achievements: [...prev.achievements, emptyAchievement()],
    }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((item) => item.id !== id),
    }))
  }

  const fields = (
    <div className="space-y-6">
      {resume.achievements.length === 0 && (
        <p className="text-center text-sm text-slate-500">No achievements added yet.</p>
      )}
      {resume.achievements.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Achievement #{index + 1}</span>
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
              label="Title"
              value={item.title}
              onChange={(e) => updateItem(item.id, 'title', e.target.value)}
              placeholder="Employee of the Year"
            />
            <Input
              label="Organization"
              value={item.organization}
              onChange={(e) => updateItem(item.id, 'organization', e.target.value)}
              placeholder="Company or event name"
            />
            <Input
              label="Date"
              type="month"
              value={item.date}
              onChange={(e) => updateItem(item.id, 'date', e.target.value)}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Description"
                rows={3}
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                placeholder="Brief description of the achievement..."
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
        Add Achievement
      </button>
    </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Achievements" icon={<Award size={16} />}>
      {fields}
    </SectionCard>
  )
}
