import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ResumeProvider, useResume } from '../context/ResumeContext'
import { isValidTemplate } from '../templates/registry'
import type { TemplateId } from '../types/resume'
import { PersonalInfoForm } from '../components/forms/PersonalInfoForm'
import { SummaryForm } from '../components/forms/SummaryForm'
import { ExperienceForm } from '../components/forms/ExperienceForm'
import { EducationForm } from '../components/forms/EducationForm'
import { SkillsForm } from '../components/forms/SkillsForm'
import { ProjectsForm } from '../components/forms/ProjectsForm'
import { AchievementsForm } from '../components/forms/AchievementsForm'
import { CertificationsForm } from '../components/forms/CertificationsForm'
import { EntryListForm } from '../components/forms/EntryListForm'
import { ReferencesForm } from '../components/forms/ReferencesForm'
import { HobbiesForm } from '../components/forms/HobbiesForm'
import { CustomSectionsForm } from '../components/forms/CustomSectionsForm'
import { CoverLetterForm } from '../components/forms/CoverLetterForm'
import { LanguagesForm } from '../components/forms/LanguagesForm'
import { BuilderStartScreen } from '../components/builder/BuilderStartScreen'
import { BuilderHeader } from '../components/builder/BuilderHeader'
import { BuilderSidebar } from '../components/builder/BuilderSidebar'
import { BuilderFooter } from '../components/builder/BuilderFooter'
import { SectionEditorHeader } from '../components/builder/SectionEditorHeader'
import { PreviewDownloadPanel } from '../components/builder/PreviewDownloadPanel'
import { OnboardingTour } from '../components/builder/OnboardingTour'
import { hasResumeContent } from '../utils/parseResumeText'
import { decodeResumeFromUrl } from '../utils/shareResume'
import { BUILDER_NAV_META, CUSTOM_NAV_META, type BuilderSection } from '../utils/sectionConfig'
import { BUILDER_STEPS } from '../utils/builderSteps'

type BuilderView = 'start' | 'editor'

function SectionContent({ section }: { section: BuilderSection }) {
  if (section === 'preview') {
    return <PreviewDownloadPanel />
  }

  const meta =
    section === 'custom'
      ? { label: CUSTOM_NAV_META.label, description: CUSTOM_NAV_META.description }
      : BUILDER_NAV_META[section]

  const wrap = (form: React.ReactNode) => (
    <div className="space-y-6">
      <SectionEditorHeader section={section} title={meta.label} description={meta.description} />
      {form}
    </div>
  )

  switch (section) {
    case 'personal':
      return wrap(<PersonalInfoForm inline />)
    case 'summary':
      return wrap(<SummaryForm inline />)
    case 'skills':
      return wrap(<SkillsForm inline />)
    case 'experience':
      return wrap(<ExperienceForm inline />)
    case 'projects':
      return wrap(<ProjectsForm inline />)
    case 'education':
      return wrap(<EducationForm inline />)
    case 'certifications':
      return wrap(<CertificationsForm inline />)
    case 'achievements':
      return wrap(<AchievementsForm inline />)
    case 'trainings':
      return wrap(
        <EntryListForm
          field="trainings"
          labels={{
            title: 'Training / Course',
            subtitle: 'Provider / Organization',
            date: 'Date',
            location: 'Location',
            description: 'Description',
            url: 'URL',
            addButton: 'Add Training',
            itemLabel: 'Training',
          }}
        />,
      )
    case 'publications':
      return wrap(
        <EntryListForm
          field="publications"
          labels={{
            title: 'Publication Title',
            subtitle: 'Publisher / Journal',
            date: 'Date',
            location: 'Venue',
            description: 'Abstract / Summary',
            url: 'URL / DOI',
            addButton: 'Add Publication',
            itemLabel: 'Publication',
          }}
        />,
      )
    case 'workshops':
      return wrap(
        <EntryListForm
          field="workshops"
          labels={{
            title: 'Workshop Title',
            subtitle: 'Organizer',
            date: 'Date',
            location: 'Location',
            description: 'Description',
            url: 'URL',
            addButton: 'Add Workshop',
            itemLabel: 'Workshop',
          }}
        />,
      )
    case 'references':
      return wrap(<ReferencesForm inline />)
    case 'hobbies':
      return wrap(<HobbiesForm inline />)
    case 'languages':
      return wrap(<LanguagesForm inline />)
    case 'custom':
      return wrap(<CustomSectionsForm inline />)
    case 'coverLetter':
      return wrap(<CoverLetterForm inline />)
  }
}

function BuilderEditor({ onNewResume }: { onNewResume: () => void }) {
  const [activeSection, setActiveSection] = useState<BuilderSection>('personal')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { undo, redo, exportJson } = useResume()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey

      if (mod && e.key === 's') {
        e.preventDefault()
        exportJson()
        return
      }
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
        return
      }

      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault()
        const idx = BUILDER_STEPS.findIndex((s) => s.id === activeSection)
        if (idx < BUILDER_STEPS.length - 1) setActiveSection(BUILDER_STEPS[idx + 1].id)
        return
      }
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault()
        const idx = BUILDER_STEPS.findIndex((s) => s.id === activeSection)
        if (idx > 0) setActiveSection(BUILDER_STEPS[idx - 1].id)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeSection, undo, redo, exportJson])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#08080f]">
      <OnboardingTour onNavigate={setActiveSection} />
      <BuilderHeader activeSection={activeSection} onNewResume={onNewResume} />

      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1">
        <BuilderSidebar
          active={activeSection}
          onChange={setActiveSection}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 lg:p-5">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="mb-3 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 lg:hidden"
          >
            <Menu size={16} />
            Sections
          </button>

          <div className="builder-dark builder-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-white/5 bg-[#0f0f18] p-5 sm:p-6">
            <SectionContent section={activeSection} />
          </div>
        </div>
      </div>

      <BuilderFooter active={activeSection} onChange={setActiveSection} />
    </div>
  )
}

function BuilderApp() {
  const [view, setView] = useState<BuilderView>('start')
  const [searchParams] = useSearchParams()
  const { resume, startFromScratch, loadFromShare, updateResume } = useResume()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const share = params.get('share')
    if (share) {
      const data = decodeResumeFromUrl(share)
      if (data) {
        loadFromShare(data)
        setView('editor')
        window.history.replaceState({}, '', '/builder')
      }
    }
  }, [loadFromShare])

  useEffect(() => {
    const template = searchParams.get('template')
    if (template && isValidTemplate(template)) {
      updateResume({ template: template as TemplateId })
      setView('editor')
    }
  }, [searchParams, updateResume])

  useEffect(() => {
    const start = searchParams.get('start')
    if (start === '1') setView('editor')
  }, [searchParams])

  if (view === 'start') {
    return (
      <BuilderStartScreen
        hasSavedProgress={hasResumeContent(resume)}
        onStartScratch={() => {
          startFromScratch()
          setView('editor')
        }}
        onContinue={() => setView('editor')}
        onImportSuccess={() => setView('editor')}
      />
    )
  }

  return <BuilderEditor onNewResume={() => setView('start')} />
}

export function BuilderPage() {
  return (
    <ResumeProvider>
      <BuilderApp />
    </ResumeProvider>
  )
}
