import { AlignLeft } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { SectionCard } from '../SectionCard'
import { Textarea } from '../ui/FormFields'

export function SummaryForm({ inline = false }: { inline?: boolean }) {
  const { resume, updateResume } = useResume()

  const fields = (
      <Textarea
        label="Summary"
        rows={4}
        value={resume.summary}
        onChange={(e) => updateResume({ summary: e.target.value })}
        placeholder="A brief overview of your professional background and key strengths..."
      />
  )

  if (inline) return fields

  return (
    <SectionCard title="Professional Summary" icon={<AlignLeft size={16} />}>
      {fields}
    </SectionCard>
  )
}
