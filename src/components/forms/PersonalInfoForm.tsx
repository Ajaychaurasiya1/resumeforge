import { User } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { SectionCard } from '../SectionCard'
import { Input } from '../ui/FormFields'

export function PersonalInfoForm({ inline = false }: { inline?: boolean }) {
  const { resume, setResume } = useResume()
  const { personalInfo } = resume

  const update = (field: keyof typeof personalInfo, value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const fields = (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          value={personalInfo.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          placeholder="John Doe"
        />
        <Input
          label="Email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="john@email.com"
        />
        <Input
          label="Phone"
          value={personalInfo.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="(555) 123-4567"
        />
        <Input
          label="Location"
          value={personalInfo.location}
          onChange={(e) => update('location', e.target.value)}
          placeholder="City, State"
        />
        <Input
          label="LinkedIn"
          value={personalInfo.linkedin}
          onChange={(e) => update('linkedin', e.target.value)}
          placeholder="linkedin.com/in/username"
        />
        <Input
          label="Website"
          value={personalInfo.website}
          onChange={(e) => update('website', e.target.value)}
          placeholder="yourwebsite.com"
        />
      </div>
  )

  if (inline) return fields

  return (
    <SectionCard title="Personal Information" icon={<User size={16} />}>
      {fields}
    </SectionCard>
  )
}
