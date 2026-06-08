import { Briefcase, Copy, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { emptyExperience, type Experience } from '../../types/resume'
import { cloneWithNewId } from '../../utils/duplicateEntry'
import { aiImproveBullets, hasOpenAiKey } from '../../utils/aiRewrite'
import { improveBullet } from '../../utils/smartRewrite'
import { SectionCard } from '../SectionCard'
import { Input, Textarea } from '../ui/FormFields'

export function ExperienceForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()
  const [improvingId, setImprovingId] = useState<string | null>(null)

  const updateItem = (id: string, field: keyof Experience, value: string | boolean) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, emptyExperience()],
    }))
  }

  const duplicateItem = (id: string) => {
    setResume((prev) => {
      const item = prev.experience.find((e) => e.id === id)
      if (!item) return prev
      const copy = cloneWithNewId(item)
      copy.position = copy.position ? `${copy.position} (Copy)` : copy.position
      const idx = prev.experience.findIndex((e) => e.id === id)
      const next = [...prev.experience]
      next.splice(idx + 1, 0, copy)
      return { ...prev, experience: next }
    })
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }))
  }

  const improveBullets = async (id: string) => {
    const item = resume.experience.find((e) => e.id === id)
    if (!item) return
    setImprovingId(id)
    try {
      const description = hasOpenAiKey()
        ? await aiImproveBullets(item.description)
        : item.description.split('\n').map((line) => improveBullet(line)).join('\n')
      setResume((prev) => ({
        ...prev,
        experience: prev.experience.map((e) =>
          e.id === id ? { ...e, description } : e,
        ),
      }))
    } finally {
      setImprovingId(null)
    }
  }

  const fields = (
    <div className="space-y-6">
      {resume.experience.map((item, index) => (
        <div key={item.id} className="relative rounded-lg border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Experience #{index + 1}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => duplicateItem(item.id)}
                className="rounded p-1 text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-400"
                title="Duplicate"
              >
                <Copy size={14} />
              </button>
              {resume.experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Company"
              value={item.company}
              onChange={(e) => updateItem(item.id, 'company', e.target.value)}
              placeholder="Company Name"
            />
            <Input
              label="Position"
              value={item.position}
              onChange={(e) => updateItem(item.id, 'position', e.target.value)}
              placeholder="Job Title"
            />
            <Input
              label="Location"
              value={item.location}
              onChange={(e) => updateItem(item.id, 'location', e.target.value)}
              placeholder="City, State"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="month"
                value={item.startDate}
                onChange={(e) => updateItem(item.id, 'startDate', e.target.value)}
              />
              <Input
                label="End Date"
                type="month"
                value={item.endDate}
                onChange={(e) => updateItem(item.id, 'endDate', e.target.value)}
                disabled={item.current}
              />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => updateItem(item.id, 'current', e.target.checked)}
              className="rounded border-slate-600 text-violet-600 focus:ring-violet-500"
            />
            I currently work here
          </label>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Description (one bullet per line)
              </span>
              <button
                type="button"
                onClick={() => improveBullets(item.id)}
                disabled={!item.description.trim() || improvingId === item.id}
                className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 disabled:opacity-40"
              >
                {improvingId === item.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                {hasOpenAiKey() ? 'AI improve' : 'Improve bullets'}
              </button>
            </div>
            <Textarea
              label="Description (one bullet per line)"
              rows={4}
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              placeholder="Led a team of 5 engineers...&#10;Increased performance by 40%..."
            />
            <p className="mt-1 text-xs text-slate-600">
              Tip: Start with action verbs and add metrics (%, $, team size).
            </p>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
      >
        <Plus size={16} />
        Add Experience
      </button>
    </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Work Experience" icon={<Briefcase size={16} />}>
      {fields}
    </SectionCard>
  )
}
