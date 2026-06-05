import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowLeft, Plus } from 'lucide-react'
import { ResumeProvider, useResume } from '../context/ResumeContext'
import { PersonalInfoForm } from '../components/forms/PersonalInfoForm'
import { SummaryForm } from '../components/forms/SummaryForm'
import { ExperienceForm } from '../components/forms/ExperienceForm'
import { EducationForm } from '../components/forms/EducationForm'
import { SkillsForm } from '../components/forms/SkillsForm'
import { ProjectsForm } from '../components/forms/ProjectsForm'
import { AchievementsForm } from '../components/forms/AchievementsForm'
import { CertificationsForm } from '../components/forms/CertificationsForm'
import { TopBar } from '../components/layout/TopBar'
import { BuilderStartScreen } from '../components/builder/BuilderStartScreen'
import { BuilderNav, type BuilderSection } from '../components/builder/BuilderNav'
import { PreviewDownloadPanel } from '../components/builder/PreviewDownloadPanel'
import { hasResumeContent } from '../utils/parseResumeText'

type BuilderView = 'start' | 'editor'

function SectionContent({ section }: { section: BuilderSection }) {
  switch (section) {
    case 'personal':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Personal Details</h2>
            <p className="mt-1 text-sm text-slate-500">Your name, contact info, and professional summary.</p>
          </div>
          <PersonalInfoForm inline />
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-300">Professional Summary</p>
            <SummaryForm inline />
          </div>
        </div>
      )
    case 'skills':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Skills</h2>
            <p className="mt-1 text-sm text-slate-500">Add technical and soft skills relevant to your target role.</p>
          </div>
          <SkillsForm inline />
        </div>
      )
    case 'experience':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Experience</h2>
            <p className="mt-1 text-sm text-slate-500">Your work history with roles, companies, and achievements.</p>
          </div>
          <ExperienceForm inline />
        </div>
      )
    case 'projects':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Projects</h2>
            <p className="mt-1 text-sm text-slate-500">Personal or professional projects worth highlighting.</p>
          </div>
          <ProjectsForm inline />
        </div>
      )
    case 'education':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Education</h2>
            <p className="mt-1 text-sm text-slate-500">Degrees, institutions, and academic background.</p>
          </div>
          <EducationForm inline />
        </div>
      )
    case 'achievements':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Achievements</h2>
            <p className="mt-1 text-sm text-slate-500">Awards, honors, and notable accomplishments.</p>
          </div>
          <AchievementsForm inline />
        </div>
      )
    case 'certifications':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Certifications</h2>
            <p className="mt-1 text-sm text-slate-500">Professional certifications, licenses, and credentials.</p>
          </div>
          <CertificationsForm inline />
        </div>
      )
    case 'preview':
      return <PreviewDownloadPanel />
  }
}

function BuilderEditor({ onNewResume }: { onNewResume: () => void }) {
  const [activeSection, setActiveSection] = useState<BuilderSection>('personal')

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#08080f]">
      <header className="z-50 shrink-0 border-b border-white/5 bg-[#08080f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <FileText size={16} className="text-white" />
              </div>
              <h1 className="text-sm font-semibold text-white">Resume Builder</h1>
            </div>
            <button
              onClick={onNewResume}
              className="hidden items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-500 transition hover:bg-white/5 hover:text-slate-300 sm:flex"
            >
              <Plus size={14} />
              New Resume
            </button>
          </div>
          <TopBar dark />
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1">
        {/* Sidebar — always visible, scrollable top to bottom */}
        <aside className="builder-scrollbar h-full w-36 shrink-0 overflow-y-auto overscroll-contain border-r border-white/5 bg-[#0a0a12] sm:w-44 lg:w-56">
          <BuilderNav active={activeSection} onChange={setActiveSection} />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 lg:p-6">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f18]">
              <div className="builder-scrollbar builder-dark min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
                <SectionContent section={activeSection} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function BuilderApp() {
  const [view, setView] = useState<BuilderView>('start')
  const { resume, startFromScratch } = useResume()

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
