import { useState } from 'react'
import { Code, Plus, X } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { SectionCard } from '../SectionCard'

export function SkillsForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()
  const [input, setInput] = useState('')

  const addSkill = () => {
    const skill = input.trim()
    if (!skill || resume.skills.includes(skill)) return
    setResume((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
    setInput('')
  }

  const removeSkill = (skill: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const fields = (
    <>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
        <button
          type="button"
          onClick={addSkill}
          className="rounded-xl bg-violet-600 px-3 py-2 text-white transition hover:bg-violet-700"
        >
          <Plus size={16} />
        </button>
      </div>
      {resume.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded-full p-0.5 transition hover:bg-violet-100"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  )

  if (inline) return fields

  return (
    <SectionCard title="Skills" icon={<Code size={16} />}>
      {fields}
    </SectionCard>
  )
}
