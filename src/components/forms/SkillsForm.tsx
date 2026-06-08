import { useState } from 'react'
import { Code, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import type { SkillCategory } from '../../types/resume'
import { aiImproveSkillCategories } from '../../utils/aiRewrite'
import {
  defaultSkillCategories,
  extractSkillsFromResumeText,
  improveSkillCategories,
} from '../../utils/skills'
import { SectionCard } from '../SectionCard'
import { Input } from '../ui/FormFields'

export function SkillsForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()
  const [improving, setImproving] = useState(false)
  const [status, setStatus] = useState('')

  const updateCategory = (id: string, field: keyof SkillCategory, value: string) => {
    setResume((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat,
      ),
    }))
  }

  const addCategory = () => {
    setResume((prev) => ({
      ...prev,
      skillCategories: [
        ...prev.skillCategories,
        { id: crypto.randomUUID(), name: 'Custom Category', skills: '' },
      ],
    }))
  }

  const removeCategory = (id: string) => {
    setResume((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((cat) => cat.id !== id),
    }))
  }

  const fetchFromResume = () => {
    const extracted = extractSkillsFromResumeText(resume)
    setResume((prev) => ({ ...prev, skillCategories: extracted }))
    setStatus('Skills updated from your resume content.')
    setTimeout(() => setStatus(''), 2500)
  }

  const handleImprove = async () => {
    setImproving(true)
    setStatus('')
    try {
      const improved = await aiImproveSkillCategories(resume.skillCategories, resume)
      setResume((prev) => ({ ...prev, skillCategories: improved }))
      setStatus('Skills improved.')
    } catch {
      setResume((prev) => ({
        ...prev,
        skillCategories: improveSkillCategories(prev.skillCategories),
      }))
      setStatus('Skills polished with local formatting.')
    } finally {
      setImproving(false)
      setTimeout(() => setStatus(''), 2500)
    }
  }

  const resetCategories = () => {
    setResume((prev) => ({ ...prev, skillCategories: defaultSkillCategories() }))
  }

  const fields = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Skill Section</h3>
        <p className="mt-1 text-xs text-slate-500">
          These are the skills which our system could fetch from your resume.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={fetchFromResume}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-violet-500/40 hover:text-violet-400"
        >
          Fetch from resume
        </button>
        <button
          type="button"
          onClick={resetCategories}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-violet-500/40 hover:text-violet-400"
        >
          Reset categories
        </button>
      </div>

      <div className="space-y-4">
        {resume.skillCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-lg border border-white/5 bg-white/[0.03] p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <Input
                label="Category"
                value={category.name}
                onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                className="flex-1"
              />
              {resume.skillCategories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="mt-5 rounded p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                  title="Remove category"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <Input
              label={`${category.name || 'Skills'}`}
              value={category.skills}
              onChange={(e) => updateCategory(category.id, 'skills', e.target.value)}
              placeholder="e.g. React.js, Next.js, HTML5, CSS3"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCategory}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
      >
        <Plus size={16} />
        Add category
      </button>

      <button
        type="button"
        onClick={handleImprove}
        disabled={improving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
      >
        <Sparkles size={16} />
        {improving ? 'Improving…' : 'Improve Skills'}
      </button>

      {status && <p className="text-xs text-violet-400">{status}</p>}
    </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Skills" icon={<Code size={16} />}>
      {fields}
    </SectionCard>
  )
}
