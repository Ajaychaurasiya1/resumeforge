import { FolderGit2, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { emptyProject, type Project } from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { Input, Textarea } from '../ui/FormFields'
import { FormLinkPreview } from '../templates/ResumeLinks'

export function ProjectsForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()

  const updateItem = (id: string, field: keyof Project, value: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, emptyProject()],
    }))
  }

  const removeItem = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }))
  }

  const fields = (
      <div className="space-y-6">
        {resume.projects.length === 0 && (
          <p className="text-center text-sm text-slate-500">No projects added yet.</p>
        )}
        {resume.projects.map((item, index) => (
          <div key={item.id} className="relative rounded-lg border border-white/5 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Project #{index + 1}</span>
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
                label="Project Name"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder="My Awesome Project"
              />
              <div>
                <Input
                  label="URL"
                  value={item.url}
                  onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                  placeholder="github.com/user/project"
                />
                <FormLinkPreview value={item.url} />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Technologies"
                  value={item.technologies}
                  onChange={(e) => updateItem(item.id, 'technologies', e.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Brief description of the project..."
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
          Add Project
        </button>
      </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Projects" icon={<FolderGit2 size={16} />} defaultOpen={false}>
      {fields}
    </SectionCard>
  )
}
