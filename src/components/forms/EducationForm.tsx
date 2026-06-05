import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyEducation, type Education } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input } from '../ui/FormFields'

export function EducationForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()

  const updateItem = (id: string, field: keyof Education, value: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, emptyEducation()],
    }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }))
  }

  const fields = (
      <div className="space-y-6">
        {resume.education.map((item, index) => (
          <div key={item.id} className="relative rounded-lg border border-white/5 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Education #{index + 1}</span>
              {resume.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Institution"
                value={item.institution}
                onChange={(e) => updateItem(item.id, 'institution', e.target.value)}
                placeholder="University Name"
              />
              <Input
                label="Degree"
                value={item.degree}
                onChange={(e) => updateItem(item.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
              <Input
                label="Field of Study"
                value={item.field}
                onChange={(e) => updateItem(item.id, 'field', e.target.value)}
                placeholder="Computer Science"
              />
              <Input
                label="GPA"
                value={item.gpa}
                onChange={(e) => updateItem(item.id, 'gpa', e.target.value)}
                placeholder="3.8"
              />
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
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Education" icon={<GraduationCap size={16} />}>
      {fields}
    </SectionCard>
  )
}
