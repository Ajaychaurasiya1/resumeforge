import { Plus, Trash2, User, X } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import {
  CANDIDATE_TYPES,
  emptyCustomUrl,
  type CandidateType,
  type CustomUrl,
  type PersonalInfo,
} from '../../types/resume'
import { SectionCard } from '../SectionCard'
import { FormLinkPreview } from '../templates/ResumeLinks'
import { Input, Select } from '../ui/FormFields'

const URL_PLACEHOLDER = 'https://'

function LabeledUrlFields({
  urlLabel,
  urlValue,
  labelLabel,
  labelValue,
  onUrlChange,
  onLabelChange,
  urlFieldLabel,
}: {
  urlLabel: string
  urlValue: string
  labelLabel: string
  labelValue: string
  onUrlChange: (value: string) => void
  onLabelChange: (value: string) => void
  urlFieldLabel: string
}) {
  return (
    <div className="sm:col-span-2 grid gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:grid-cols-2">
      <div>
        <Input
          label={urlFieldLabel}
          value={urlValue}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={URL_PLACEHOLDER}
        />
        <FormLinkPreview value={urlValue} />
      </div>
      <Input
        label={labelLabel}
        value={labelValue}
        onChange={(e) => onLabelChange(e.target.value)}
        placeholder={urlLabel}
      />
    </div>
  )
}

export function PersonalInfoForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()
  const { personalInfo } = resume

  const update = (field: keyof PersonalInfo, value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const updateCustomUrl = (id: string, field: keyof CustomUrl, value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customUrls: prev.personalInfo.customUrls.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      },
    }))
  }

  const addCustomUrl = () => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customUrls: [...prev.personalInfo.customUrls, emptyCustomUrl()],
      },
    }))
  }

  const removeCustomUrl = (id: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customUrls: prev.personalInfo.customUrls.filter((item) => item.id !== id),
      },
    }))
  }

  const handlePhotoUpload = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') update('photoUrl', reader.result)
    }
    reader.readAsDataURL(file)
  }

  const fields = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative">
          {personalInfo.photoUrl ? (
            <img
              src={personalInfo.photoUrl}
              alt="Profile"
              className="h-20 w-20 rounded-xl object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/5 text-slate-600">
              <User size={28} />
            </div>
          )}
          {personalInfo.photoUrl && (
            <button
              type="button"
              onClick={() => update('photoUrl', '')}
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
              title="Remove photo"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Profile photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
            className="mt-1 block text-xs text-slate-400 file:mr-2 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-violet-500"
          />
          <p className="mt-1 text-xs text-slate-600">Optional — shown on photo-ready templates.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          value={personalInfo.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          placeholder="Name"
        />
        <Input
          label="Phone"
          value={personalInfo.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="Phone"
        />
        <Input
          label="Email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="Email"
        />
        <Input
          label="Role"
          value={personalInfo.role}
          onChange={(e) => update('role', e.target.value)}
          placeholder="e.g. Front End Developer/Marketing Intern"
        />
        <Select
          label="Candidate Type"
          value={personalInfo.candidateType}
          onChange={(e) => update('candidateType', e.target.value as CandidateType)}
          options={CANDIDATE_TYPES}
        />
        <Input
          label="Location"
          value={personalInfo.location}
          onChange={(e) => update('location', e.target.value)}
          placeholder="Location"
        />

        <LabeledUrlFields
          urlFieldLabel="LinkedIn URL"
          urlValue={personalInfo.linkedin}
          onUrlChange={(v) => update('linkedin', v)}
          labelLabel="URL Label"
          labelValue={personalInfo.linkedinLabel}
          onLabelChange={(v) => update('linkedinLabel', v)}
          urlLabel="LinkedIn"
        />

        <LabeledUrlFields
          urlFieldLabel="Portfolio URL"
          urlValue={personalInfo.portfolio}
          onUrlChange={(v) => update('portfolio', v)}
          labelLabel="URL Label"
          labelValue={personalInfo.portfolioLabel}
          onLabelChange={(v) => update('portfolioLabel', v)}
          urlLabel="Portfolio"
        />

        <LabeledUrlFields
          urlFieldLabel="Github URL"
          urlValue={personalInfo.github}
          onUrlChange={(v) => update('github', v)}
          labelLabel="URL Label"
          labelValue={personalInfo.githubLabel}
          onLabelChange={(v) => update('githubLabel', v)}
          urlLabel="GitHub"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Custom URL&apos;s
          </span>
        </div>
        <div className="space-y-4">
          {personalInfo.customUrls.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg border border-white/5 bg-white/[0.03] p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Custom URL #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCustomUrl(item.id)}
                  className="rounded p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Input
                    label="URL"
                    value={item.url}
                    onChange={(e) => updateCustomUrl(item.id, 'url', e.target.value)}
                    placeholder={URL_PLACEHOLDER}
                  />
                  <FormLinkPreview value={item.url} />
                </div>
                <Input
                  label="URL Label"
                  value={item.label}
                  onChange={(e) => updateCustomUrl(item.id, 'label', e.target.value)}
                  placeholder="Label"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCustomUrl}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
        >
          <Plus size={16} />
          Add Custom Url
        </button>
      </div>
    </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Personal Information" icon={<User size={16} />}>
      {fields}
    </SectionCard>
  )
}
