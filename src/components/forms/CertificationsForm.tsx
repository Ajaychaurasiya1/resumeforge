import { Award, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyCertification, type Certification } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input } from '../ui/FormFields'

export function CertificationsForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()

  const updateItem = (id: string, field: keyof Certification, value: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [...prev.certifications, emptyCertification()],
    }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }))
  }

  const fields = (
      <div className="space-y-6">
        {resume.certifications.length === 0 && (
          <p className="text-center text-sm text-slate-500">No certifications added yet.</p>
        )}
        {resume.certifications.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Certification #{index + 1}
              </span>
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
                label="Certification Name"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder="AWS Solutions Architect"
              />
              <Input
                label="Issuing Organization"
                value={item.issuer}
                onChange={(e) => updateItem(item.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
              <Input
                label="Date Earned"
                type="month"
                value={item.date}
                onChange={(e) => updateItem(item.id, 'date', e.target.value)}
              />
              <Input
                label="Credential URL"
                value={item.url}
                onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                placeholder="credly.com/badges/..."
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
          Add Certification
        </button>
      </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Certifications" icon={<Award size={16} />} defaultOpen={false}>
      {fields}
    </SectionCard>
  )
}
