import type { ReactNode } from 'react'
import type { ResumeData, SectionId, TemplateId } from '../../types/resume'
import { formatDate, formatDateRange, splitLines } from '../../utils/format'
import { ACCENT_MAP, FONT_SIZE_MAP } from '../../utils/theme'

interface SectionProps {
  data: ResumeData
  template: TemplateId
  sectionId: SectionId
}

function sectionMargin(template: TemplateId): string {
  if (template === 'compact') return 'mt-3'
  if (template === 'elegant') return 'mt-6'
  if (template === 'modern') return 'mt-5'
  return 'mt-4'
}

function SectionHeading({
  title,
  template,
  accent,
  accentBorder,
  accentBg,
  fontSection,
}: {
  title: string
  template: TemplateId
  accent: string
  accentBorder: string
  accentBg: string
  fontSection: string
}) {
  switch (template) {
    case 'classic':
      return (
        <h2 className={`mb-2 border-b border-slate-300 font-bold uppercase tracking-wider ${fontSection}`}>
          {title}
        </h2>
      )
    case 'professional':
      return (
        <h2 className={`mb-2 border-l-4 ${accentBorder} pl-3 font-bold uppercase tracking-wide ${fontSection}`}>
          {title}
        </h2>
      )
    case 'executive':
      return (
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-300" />
          <h2 className={`font-bold uppercase tracking-[0.2em] ${fontSection}`}>{title}</h2>
          <div className="h-px flex-1 bg-slate-300" />
        </div>
      )
    case 'compact':
      return (
        <h2 className={`mb-1 font-bold uppercase ${fontSection} text-slate-800`}>
          {title}
        </h2>
      )
    case 'harvard':
      return (
        <h2 className={`mb-2 font-semibold uppercase tracking-[0.15em] text-slate-700 ${fontSection}`}>
          {title}
        </h2>
      )
    case 'technical':
      return (
        <h2 className={`mb-2 inline-block rounded px-2 py-0.5 font-bold uppercase tracking-wide text-white ${accentBg} ${fontSection}`}>
          {title}
        </h2>
      )
    case 'elegant':
      return (
        <h2 className={`mb-3 border-b border-slate-200 pb-1 font-serif italic ${fontSection} text-slate-700`}>
          {title}
        </h2>
      )
    case 'minimal':
      return (
        <h2 className={`mb-2 font-semibold uppercase tracking-widest ${fontSection} ${accent}`}>
          {title}
        </h2>
      )
    case 'chronological':
      return (
        <h2 className={`mb-3 font-bold uppercase tracking-wider ${fontSection} ${accent}`}>
          {title}
        </h2>
      )
    default:
      return (
        <h2 className={`mb-3 font-bold uppercase tracking-wider ${fontSection} ${accent}`}>
          {title}
        </h2>
      )
  }
}

function SummarySection({ data, template }: SectionProps) {
  if (!data.summary) return null
  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={template === 'modern' ? '' : sectionMargin(template)}>
      <SectionHeading
        title={template === 'modern' ? 'Profile' : 'Summary'}
        template={template}
        accent={colors.text}
        accentBorder={colors.border}
        accentBg={colors.bg}
        fontSection={section}
      />
      <p className={`leading-relaxed text-slate-600 ${body} ${template === 'compact' ? 'text-justify' : ''}`}>
        {data.summary}
      </p>
    </section>
  )
}

function ExperienceSection({ data, template }: SectionProps) {
  const items = data.experience.filter((e) => e.company || e.position)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeading title="Experience" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
      <div className={template === 'compact' ? 'space-y-2' : 'space-y-3'}>
        {items.map((exp) => {
          const dates = formatDateRange(exp.startDate, exp.endDate, exp.current)

          if (template === 'chronological') {
            return (
              <div key={exp.id} className="flex gap-4">
                <div className={`w-[88px] shrink-0 text-xs font-bold text-slate-600 ${colors.text}`}>
                  {dates}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold ${body}`}>{exp.position}</p>
                  <p className={`text-xs text-slate-500`}>
                    {exp.company}{exp.location && ` · ${exp.location}`}
                  </p>
                  {exp.description && (
                    <ul className={`mt-1 list-inside list-disc space-y-0.5 text-slate-600 ${body}`}>
                      {splitLines(exp.description).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          }

          return (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-2">
                {template === 'classic' ? (
                  <div>
                    <span className="font-bold">{exp.position}</span>
                    {exp.company && <span className={` ${body}`}> — {exp.company}</span>}
                  </div>
                ) : (
                  <h3 className={`font-semibold ${body}`}>{exp.position}</h3>
                )}
                <span className="shrink-0 text-xs text-slate-400">{dates}</span>
              </div>
              {template !== 'classic' && (
                <p className={`font-medium text-xs ${template === 'minimal' ? 'text-slate-500' : colors.text}`}>
                  {exp.company}
                  {exp.location && ` · ${exp.location}`}
                </p>
              )}
              {template === 'classic' && exp.location && (
                <p className="text-xs italic text-slate-500">{exp.location}</p>
              )}
              {exp.description && (
                <ul className={`mt-1 list-inside list-disc space-y-0.5 text-slate-600 ${body}`}>
                  {splitLines(exp.description).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function EducationSection({ data, template }: SectionProps) {
  const items = data.education.filter((e) => e.institution || e.degree)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeading title="Education" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
      <div className="space-y-2">
        {items.map((edu) => (
          <div key={edu.id} className="flex items-baseline justify-between gap-2">
            <div>
              <span className={`font-bold ${body}`}>{edu.institution}</span>
              {(edu.degree || edu.field) && (
                <span className={body}> — {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>
              )}
              {edu.gpa && <span className={`text-slate-500 ${body}`}> · GPA: {edu.gpa}</span>}
            </div>
            <span className="shrink-0 text-xs text-slate-400">
              {formatDateRange(edu.startDate, edu.endDate, false)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection({ data, template, asList = false }: SectionProps & { asList?: boolean }) {
  if (data.skills.length === 0) return null

  const accent = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  if (asList) {
    return (
      <div>
        <h2 className={`mb-2 text-xs font-semibold uppercase tracking-widest ${accent.sidebarText}`}>
          Skills
        </h2>
        <ul className="space-y-1 text-xs text-slate-300">
          {data.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    )
  }

  const showPills = template === 'minimal' || template === 'technical'

  return (
    <section className={sectionMargin(template)}>
      <SectionHeading title="Skills" template={template} accent={accent.text} accentBorder={accent.border} accentBg={accent.bg} fontSection={section} />
      {showPills ? (
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className={`rounded px-2 py-0.5 ${body} ${
                template === 'technical'
                  ? `${accent.bg} text-white`
                  : 'border border-slate-200 text-slate-700'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : template === 'compact' ? (
        <p className={`${body} text-slate-700`}>{data.skills.join(' | ')}</p>
      ) : (
        <p className={body}>{data.skills.join(' · ')}</p>
      )}
    </section>
  )
}

function ProjectsSection({ data, template }: SectionProps) {
  const items = data.projects.filter((p) => p.name)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeading title="Projects" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
      <div className="space-y-2">
        {items.map((proj) => (
          <div key={proj.id}>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold ${body}`}>{proj.name}</span>
              {proj.url && <span className="text-xs text-slate-400">{proj.url}</span>}
            </div>
            {proj.description && <p className={`text-slate-600 ${body}`}>{proj.description}</p>}
            {proj.technologies && (
              <p className={`text-xs ${template === 'modern' || template === 'technical' ? colors.text : 'text-slate-500'}`}>
                {proj.technologies}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function AchievementsSection({ data, template }: SectionProps) {
  const items = data.achievements.filter((a) => a.title)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeading title="Achievements" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className={`font-bold ${body}`}>{item.title}</span>
                {item.organization && <span className={body}> — {item.organization}</span>}
              </div>
              {item.date && (
                <span className="shrink-0 text-xs text-slate-400">{formatDate(item.date)}</span>
              )}
            </div>
            {item.description && (
              <p className={`mt-0.5 text-slate-600 ${body}`}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function CertificationsSection({ data, template }: SectionProps) {
  const items = data.certifications.filter((c) => c.name)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeading title="Certifications" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
      <div className="space-y-2">
        {items.map((cert) => (
          <div key={cert.id} className="flex items-baseline justify-between gap-2">
            <div>
              <span className={`font-bold ${body}`}>{cert.name}</span>
              {cert.issuer && <span className={body}> — {cert.issuer}</span>}
            </div>
            {cert.date && <span className="shrink-0 text-xs text-slate-400">{formatDate(cert.date)}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

function LanguagesSection({ data, template, asList = false }: SectionProps & { asList?: boolean }) {
  const items = data.languages.filter((l) => l.name)
  if (items.length === 0) return null

  const accent = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  if (asList) {
    return (
      <div>
        <h2 className={`mb-2 text-xs font-semibold uppercase tracking-widest ${accent.sidebarText}`}>
          Languages
        </h2>
        <ul className="space-y-1 text-xs text-slate-300">
          {items.map((lang) => (
            <li key={lang.id}>
              {lang.name}{lang.proficiency && ` — ${lang.proficiency}`}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <section className={sectionMargin(template)}>
      <SectionHeading title="Languages" template={template} accent={accent.text} accentBorder={accent.border} accentBg={accent.bg} fontSection={section} />
      <div className={`space-y-1 ${body}`}>
        {items.map((lang) => (
          <div key={lang.id} className="flex justify-between gap-2">
            <span className="font-medium">{lang.name}</span>
            {lang.proficiency && <span className="text-slate-500">{lang.proficiency}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

const SECTION_RENDERERS: Record<SectionId, (props: SectionProps) => ReactNode> = {
  summary: (p) => <SummarySection {...p} />,
  experience: (p) => <ExperienceSection {...p} />,
  education: (p) => <EducationSection {...p} />,
  skills: (p) => <SkillsSection {...p} />,
  projects: (p) => <ProjectsSection {...p} />,
  achievements: (p) => <AchievementsSection {...p} />,
  certifications: (p) => <CertificationsSection {...p} />,
  languages: (p) => <LanguagesSection {...p} />,
}

export function getVisibleSections(data: ResumeData): SectionId[] {
  return data.settings.sectionOrder.filter((id) => !data.settings.hiddenSections.includes(id))
}

export function TemplateSections({
  data,
  template,
  excludeSidebar = false,
}: {
  data: ResumeData
  template: TemplateId
  excludeSidebar?: boolean
}) {
  const sections = getVisibleSections(data).filter((id) => {
    if (excludeSidebar && template === 'modern') {
      return id !== 'skills' && id !== 'languages'
    }
    return true
  })

  return (
    <>
      {sections.map((id) => (
        <div key={id}>{SECTION_RENDERERS[id]({ data, template, sectionId: id })}</div>
      ))}
    </>
  )
}

export function ModernSidebar({ data }: { data: ResumeData }) {
  const hidden = data.settings.hiddenSections
  const accent = ACCENT_MAP[data.settings.accentColor]
  const { name } = FONT_SIZE_MAP[data.settings.fontSize]
  const { personalInfo } = data

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean)

  const showSkills = !hidden.includes('skills') && data.skills.length > 0
  const showLanguages = !hidden.includes('languages') && data.languages.some((l) => l.name)

  return (
    <aside className={`w-[35%] p-5 text-white ${accent.bg}`}>
      <h1 className={`font-bold leading-tight ${name}`}>{personalInfo.fullName || 'Your Name'}</h1>
      {contactItems.length > 0 && (
        <div className="mt-5">
          <h2 className={`mb-2 text-xs font-semibold uppercase tracking-widest ${accent.sidebarText}`}>
            Contact
          </h2>
          <ul className="space-y-1.5 text-xs leading-relaxed text-white/80">
            {contactItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {showSkills && (
        <div className="mt-5">
          <SkillsSection data={data} template="modern" sectionId="skills" asList />
        </div>
      )}
      {showLanguages && (
        <div className="mt-5">
          <LanguagesSection data={data} template="modern" sectionId="languages" asList />
        </div>
      )}
    </aside>
  )
}

export function TemplateHeader({ data, template }: { data: ResumeData; template: TemplateId }) {
  const { personalInfo } = data
  const { name, body } = FONT_SIZE_MAP[data.settings.fontSize]
  const accent = ACCENT_MAP[data.settings.accentColor]

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean)

  const contactStr = contactItems.join(' · ')
  const displayName = personalInfo.fullName || 'Your Name'

  switch (template) {
    case 'classic':
      return (
        <header className="border-b-2 border-slate-800 pb-3 text-center">
          <h1 className={`font-bold tracking-wide ${name}`}>{displayName}</h1>
          {contactStr && <p className={`mt-1 text-slate-600 ${body}`}>{contactStr}</p>}
        </header>
      )

    case 'minimal':
      return (
        <header className="mb-6">
          <h1 className={`font-bold tracking-tight ${name}`}>{displayName}</h1>
          {contactStr && <p className={`mt-2 text-slate-500 ${body}`}>{contactItems.join('  ·  ')}</p>}
          <div className={`mt-4 h-0.5 w-12 ${accent.bg}`} />
        </header>
      )

    case 'professional':
      return (
        <header className={`mb-5 border-b-2 ${accent.border} pb-4`}>
          <h1 className={`font-bold ${name} text-slate-900`}>{displayName}</h1>
          {contactStr && <p className={`mt-2 text-slate-600 ${body}`}>{contactStr}</p>}
        </header>
      )

    case 'executive':
      return (
        <header className="mb-6 text-center">
          <div className="mb-3 border-t-2 border-b-2 border-slate-800 py-3">
            <h1 className={`font-bold uppercase tracking-[0.15em] ${name}`}>{displayName}</h1>
          </div>
          {contactStr && <p className={`text-slate-600 ${body}`}>{contactStr}</p>}
        </header>
      )

    case 'compact':
      return (
        <header className="mb-4 border-b border-slate-400 pb-2">
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {contactStr && <p className={`mt-0.5 text-slate-600 ${body}`}>{contactStr}</p>}
        </header>
      )

    case 'harvard':
      return (
        <header className="mb-5">
          <h1 className={`font-bold ${name} text-slate-900`}>{displayName}</h1>
          {contactStr && <p className={`mt-1 text-slate-600 ${body}`}>{contactStr}</p>}
        </header>
      )

    case 'chronological':
      return (
        <header className={`mb-5 border-b ${accent.border} pb-3`}>
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {contactStr && <p className={`mt-1 text-slate-500 ${body}`}>{contactStr}</p>}
        </header>
      )

    case 'technical':
      return (
        <header className={`mb-5 ${accent.bg} -mx-2 rounded px-4 py-4 text-white sm:-mx-0`}>
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {contactStr && <p className={`mt-1 text-white/80 ${body}`}>{contactStr}</p>}
        </header>
      )

    case 'elegant':
      return (
        <header className="mb-8 text-center">
          <h1 className={`font-serif font-light tracking-wide ${name} text-slate-800`}>{displayName}</h1>
          <div className="mx-auto mt-3 h-px w-24 bg-slate-300" />
          {contactStr && <p className={`mt-3 text-slate-500 ${body}`}>{contactStr}</p>}
        </header>
      )

    default:
      return (
        <header className="mb-5">
          <h1 className={`font-bold ${name}`}>{displayName}</h1>
          {contactStr && <p className={`mt-1 text-slate-600 ${body}`}>{contactStr}</p>}
        </header>
      )
  }
}
