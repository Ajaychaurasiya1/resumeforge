import type { ReactNode } from 'react'
import type {
  CustomSection,
  ResumeData,
  ResumeEntry,
  SectionId,
  TemplateId,
} from '../../types/resume'
import { isCoreSectionId } from '../../types/resume'
import { getTemplateTheme, SPLIT_LEFT_SECTIONS } from '../../templates/themes'
import { formatDate, formatDateRange, splitLines } from '../../utils/format'
import { getPersonalContactItems, getPersonalSubtitle } from '../../utils/personalInfo'
import { hasSkillContent } from '../../utils/skills'
import { ACCENT_MAP, FONT_SIZE_MAP } from '../../utils/theme'
import { ExternalUrlLink, ResumeLink, ResumeTextLink } from './ResumeLinks'
import { SectionHeading as ThemedSectionHeading } from './SectionHeading'

interface SectionProps {
  data: ResumeData
  template: TemplateId
  sectionId: SectionId
  sectionIndex?: number
}

function sectionMargin(template: TemplateId): string {
  const gap = getTemplateTheme(template).sectionGap
  if (gap === 'tight') return 'mt-3'
  if (gap === 'relaxed') return 'mt-6'
  if (template === 'modern' || template === 'metro') return 'mt-5'
  return 'mt-4'
}

function SectionHeadingBlock({
  title,
  template,
  accent,
  accentBorder,
  accentBg,
  fontSection,
  index,
}: {
  title: string
  template: TemplateId
  accent: string
  accentBorder: string
  accentBg: string
  fontSection: string
  index?: number
}) {
  const theme = getTemplateTheme(template)
  return (
    <ThemedSectionHeading
      title={title}
      variant={theme.sectionHeading}
      accent={accent}
      accentBorder={accentBorder}
      accentBg={accentBg}
      fontSection={fontSection}
      index={index}
    />
  )
}

function SummarySection({ data, template, sectionIndex }: SectionProps & { sectionIndex?: number }) {
  if (!data.summary) return null
  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]
  const theme = getTemplateTheme(template)
  const isSidebarMain = template === 'modern'

  return (
    <section className={isSidebarMain ? '' : sectionMargin(template)}>
      <SectionHeadingBlock
        title={theme.summaryTitle}
        template={template}
        accent={colors.text}
        accentBorder={colors.border}
        accentBg={colors.bg}
        fontSection={section}
        index={sectionIndex}
      />
      <p className={`leading-relaxed text-slate-600 ${body} ${theme.sectionGap === 'tight' ? 'text-justify' : ''}`}>
        {data.summary}
      </p>
    </section>
  )
}

function ExperienceSection({ data, template, sectionIndex }: SectionProps & { sectionIndex?: number }) {
  const items = data.experience.filter((e) => e.company || e.position)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]
  const expLayout = getTemplateTheme(template).experience
  const isCompact = getTemplateTheme(template).sectionGap === 'tight'

  const renderEntry = (exp: (typeof items)[0], isLast: boolean) => {
    const dates = formatDateRange(exp.startDate, exp.endDate, exp.current)

    if (expLayout === 'chronological') {
      return (
        <div key={exp.id} className="flex gap-4">
          <div className={`w-[88px] shrink-0 text-xs font-bold text-slate-600 ${colors.text}`}>{dates}</div>
          <div className="min-w-0 flex-1">
            <p className={`font-bold ${body}`}>{exp.position}</p>
            <p className="text-xs text-slate-500">
              {exp.company}
              {exp.location && ` · ${exp.location}`}
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

    if (expLayout === 'timeline') {
      return (
        <div key={exp.id} className="relative pl-6 pb-4">
          {!isLast && <div className="absolute bottom-0 left-[5px] top-3 w-0.5 bg-slate-200" />}
          <div className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ${colors.bg}`} />
          <p className={`text-xs font-semibold ${colors.text}`}>{dates}</p>
          <p className={`font-bold ${body}`}>{exp.position}</p>
          <p className="text-xs text-slate-500">
            {exp.company}
            {exp.location && ` · ${exp.location}`}
          </p>
          {exp.description && (
            <ul className={`mt-1 list-inside list-disc space-y-0.5 text-slate-600 ${body}`}>
              {splitLines(exp.description).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    const cardWrap = expLayout === 'card'
    const inner = (
      <>
        <div className="flex items-baseline justify-between gap-2">
          {expLayout === 'classic-inline' ? (
            <div>
              <span className="font-bold">{exp.position}</span>
              {exp.company && <span className={` ${body}`}> — {exp.company}</span>}
            </div>
          ) : (
            <h3 className={`font-semibold ${body}`}>{exp.position}</h3>
          )}
          <span className="shrink-0 text-xs text-slate-400">{dates}</span>
        </div>
        {expLayout !== 'classic-inline' && (
          <p className={`font-medium text-xs ${template === 'minimal' ? 'text-slate-500' : colors.text}`}>
            {exp.company}
            {exp.location && ` · ${exp.location}`}
          </p>
        )}
        {expLayout === 'classic-inline' && exp.location && (
          <p className="text-xs italic text-slate-500">{exp.location}</p>
        )}
        {exp.description && (
          <ul className={`mt-1 list-inside list-disc space-y-0.5 text-slate-600 ${body}`}>
            {splitLines(exp.description).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </>
    )

    if (cardWrap) {
      return (
        <div key={exp.id} className={`rounded-lg border ${colors.border} border-opacity-30 bg-slate-50/80 p-3`}>
          {inner}
        </div>
      )
    }

    return <div key={exp.id}>{inner}</div>
  }

  return (
    <section className={sectionMargin(template)}>
      <SectionHeadingBlock
        title="Experience"
        template={template}
        accent={colors.text}
        accentBorder={colors.border}
        accentBg={colors.bg}
        fontSection={section}
        index={sectionIndex}
      />
      <div className={isCompact ? 'space-y-2' : expLayout === 'timeline' ? '' : 'space-y-3'}>
        {items.map((exp, index) => renderEntry(exp, index === items.length - 1))}
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
      <SectionHeadingBlock title="Education" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
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
  const categories = data.skillCategories.filter((c) => c.skills.trim())
  if (categories.length === 0) return null

  const accent = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  if (asList) {
    return (
      <div>
        <h2 className={`mb-2 text-xs font-semibold uppercase tracking-widest ${accent.sidebarText}`}>
          Skills
        </h2>
        <ul className="space-y-2 text-xs text-slate-300">
          {categories.map((cat) => (
            <li key={cat.id}>
              <span className="font-semibold text-white/90">{cat.name}: </span>
              {cat.skills}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const skillsLayout = getTemplateTheme(template).skills
  const usePills = skillsLayout === 'pills-outline' || skillsLayout === 'pills-filled'
  const filledPills = skillsLayout === 'pills-filled'

  return (
    <section className={sectionMargin(template)}>
      <SectionHeadingBlock title="Skills" template={template} accent={accent.text} accentBorder={accent.border} accentBg={accent.bg} fontSection={section} />
      {skillsLayout === 'inline-compact' ? (
        <div className={`space-y-0.5 ${body}`}>
          {categories.map((cat) => (
            <p key={cat.id} className="text-slate-700">
              <span className="font-bold text-slate-900">{cat.name}: </span>
              {cat.skills.trim()}
            </p>
          ))}
        </div>
      ) : usePills ? (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id}>
              <span className={`font-semibold ${body} text-slate-800`}>{cat.name}: </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {cat.skills.split(',').map((skill) => {
                  const trimmed = skill.trim()
                  if (!trimmed) return null
                  return (
                    <span
                      key={`${cat.id}-${trimmed}`}
                      className={`rounded px-2 py-0.5 ${body} ${
                        filledPills
                          ? `${accent.bg} text-white`
                          : 'border border-slate-200 text-slate-700'
                      }`}
                    >
                      {trimmed}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`space-y-1.5 ${body}`}>
          {categories.map((cat) => (
            <p key={cat.id} className="text-slate-700">
              <span className="font-semibold text-slate-900">{cat.name}: </span>
              {cat.skills.trim()}
            </p>
          ))}
        </div>
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
      <SectionHeadingBlock title="Projects" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
      <div className="space-y-2">
        {items.map((proj) => (
          <div key={proj.id}>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold ${body}`}>{proj.name}</span>
              {proj.url && <ExternalUrlLink url={proj.url} />}
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
      <SectionHeadingBlock title="Achievements" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
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
      <SectionHeadingBlock title="Certifications" template={template} accent={colors.text} accentBorder={colors.border} accentBg={colors.bg} fontSection={section} />
      <div className="space-y-2">
        {items.map((cert) => (
          <div key={cert.id}>
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className={`font-bold ${body}`}>{cert.name}</span>
                {cert.issuer && <span className={body}> — {cert.issuer}</span>}
              </div>
              {cert.date && (
                <span className="shrink-0 text-xs text-slate-400">{formatDate(cert.date)}</span>
              )}
            </div>
            {cert.url && (
              <ExternalUrlLink url={cert.url} className={`mt-0.5 block ${body} text-xs text-slate-400`} />
            )}
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
      <SectionHeadingBlock title="Languages" template={template} accent={accent.text} accentBorder={accent.border} accentBg={accent.bg} fontSection={section} />
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

function EntryListSection({
  data,
  template,
  title,
  items,
  sectionIndex,
}: {
  data: ResumeData
  template: TemplateId
  title: string
  items: ResumeEntry[]
  sectionIndex?: number
}) {
  const filtered = items.filter((item) => item.title)
  if (filtered.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeadingBlock
        title={title}
        template={template}
        accent={colors.text}
        accentBorder={colors.border}
        accentBg={colors.bg}
        fontSection={section}
        index={sectionIndex}
      />
      <div className="space-y-2">
        {filtered.map((item) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className={`font-bold ${body}`}>{item.title}</span>
                {item.subtitle && <span className={body}> — {item.subtitle}</span>}
                {item.location && (
                  <span className={`text-slate-500 ${body}`}> · {item.location}</span>
                )}
              </div>
              {item.date && (
                <span className="shrink-0 text-xs text-slate-400">{formatDate(item.date)}</span>
              )}
            </div>
            {item.description && <p className={`text-slate-600 ${body}`}>{item.description}</p>}
            {item.url && <ExternalUrlLink url={item.url} />}
          </div>
        ))}
      </div>
    </section>
  )
}

function ReferencesSection({ data, template }: SectionProps) {
  const items = data.references.filter((r) => r.name)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeadingBlock
        title="References"
        template={template}
        accent={colors.text}
        accentBorder={colors.border}
        accentBg={colors.bg}
        fontSection={section}
      />
      <div className={`space-y-2 ${body}`}>
        {items.map((ref) => (
          <div key={ref.id}>
            <span className="font-bold">{ref.name}</span>
            {(ref.title || ref.company) && (
              <span className="text-slate-600">
                {' '}
                — {[ref.title, ref.company].filter(Boolean).join(', ')}
              </span>
            )}
            {(ref.email || ref.phone) && (
              <p className="text-xs text-slate-500">
                {[ref.email, ref.phone]
                  .filter(Boolean)
                  .map((part, index) => (
                    <span key={part}>
                      {index > 0 && ' · '}
                      <ResumeTextLink
                        value={part}
                        className="underline decoration-slate-300/70 underline-offset-2 hover:decoration-current"
                      />
                    </span>
                  ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function HobbiesSection({ data, template }: SectionProps) {
  const items = data.hobbies.filter((h) => h.name)
  if (items.length === 0) return null

  const colors = ACCENT_MAP[data.settings.accentColor]
  const { section, body } = FONT_SIZE_MAP[data.settings.fontSize]

  return (
    <section className={sectionMargin(template)}>
      <SectionHeadingBlock
        title="Hobbies"
        template={template}
        accent={colors.text}
        accentBorder={colors.border}
        accentBg={colors.bg}
        fontSection={section}
      />
      <div className={`space-y-1 ${body}`}>
        {items.map((hobby) => (
          <div key={hobby.id}>
            <span className="font-medium">{hobby.name}</span>
            {hobby.description && (
              <span className="text-slate-600"> — {hobby.description}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function CustomSectionBlock({
  data,
  template,
  section,
  sectionIndex,
}: {
  data: ResumeData
  template: TemplateId
  section: CustomSection
  sectionIndex?: number
}) {
  return (
    <EntryListSection
      data={data}
      template={template}
      title={section.title || 'Custom Section'}
      items={section.items}
      sectionIndex={sectionIndex}
    />
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
  trainings: (p) => (
    <EntryListSection
      data={p.data}
      template={p.template}
      title="Trainings"
      items={p.data.trainings}
    />
  ),
  publications: (p) => (
    <EntryListSection
      data={p.data}
      template={p.template}
      title="Publications"
      items={p.data.publications}
    />
  ),
  workshops: (p) => (
    <EntryListSection
      data={p.data}
      template={p.template}
      title="Workshops"
      items={p.data.workshops}
    />
  ),
  references: (p) => <ReferencesSection {...p} />,
  hobbies: (p) => <HobbiesSection {...p} />,
  languages: (p) => <LanguagesSection {...p} />,
}

export function getVisibleSections(data: ResumeData): string[] {
  return data.settings.sectionOrder.filter((id) => !data.settings.hiddenSections.includes(id))
}

export function TemplateSections({
  data,
  template,
  excludeSidebar = false,
  column,
}: {
  data: ResumeData
  template: TemplateId
  excludeSidebar?: boolean
  column?: 'left' | 'right'
}) {
  const leftSet = new Set<string>(SPLIT_LEFT_SECTIONS)

  const sections = getVisibleSections(data).filter((id) => {
    if (excludeSidebar && (template === 'modern' || template === 'metro')) {
      return id !== 'skills' && id !== 'languages'
    }
    if (column === 'left') return leftSet.has(id)
    if (column === 'right') return !leftSet.has(id)
    return true
  })

  let sectionIndex = 0

  return (
    <>
      {sections.map((id) => {
        const index = sectionIndex
        sectionIndex += 1

        if (isCoreSectionId(id)) {
          const renderer = SECTION_RENDERERS[id]
          return <div key={id}>{renderer({ data, template, sectionId: id, sectionIndex: index })}</div>
        }
        const custom = data.customSections.find((s) => s.id === id)
        if (custom) {
          return (
            <div key={id}>
              <CustomSectionBlock data={data} template={template} section={custom} sectionIndex={index} />
            </div>
          )
        }
        return null
      })}
    </>
  )
}

export function TemplateSidebar({
  data,
  template,
  position,
}: {
  data: ResumeData
  template: TemplateId
  position: 'left' | 'right'
}) {
  const theme = getTemplateTheme(template)
  const hidden = data.settings.hiddenSections
  const accent = ACCENT_MAP[data.settings.accentColor]
  const { name } = FONT_SIZE_MAP[data.settings.fontSize]
  const { personalInfo } = data

  const contactItems = getPersonalContactItems(personalInfo)
  const subtitle = getPersonalSubtitle(personalInfo)
  const showContact = theme.sidebarSections.includes('contact')
  const showSkills =
    theme.sidebarSections.includes('skills') && !hidden.includes('skills') && hasSkillContent(data.skillCategories)
  const showLanguages =
    theme.sidebarSections.includes('languages') &&
    !hidden.includes('languages') &&
    data.languages.some((l) => l.name)

  const isModern = template === 'modern'

  return (
    <aside
      className={`w-[35%] p-5 text-white ${accent.bg} ${position === 'right' ? 'order-2' : 'order-1'}`}
    >
      {isModern && personalInfo.photoUrl && (
        <img
          src={personalInfo.photoUrl}
          alt=""
          className="mb-4 h-24 w-24 rounded-full object-cover ring-2 ring-white/30"
        />
      )}
      {isModern && (
        <>
          <h1 className={`font-bold leading-tight ${name}`}>{personalInfo.fullName || 'Your Name'}</h1>
          {subtitle && <p className="mt-1 text-xs text-white/70">{subtitle}</p>}
        </>
      )}

      {showContact && contactItems.length > 0 && (
        <div className={isModern ? 'mt-5' : ''}>
          <h2 className={`mb-2 text-xs font-semibold uppercase tracking-widest ${accent.sidebarText}`}>
            Contact
          </h2>
          <ul className="space-y-1.5 text-xs leading-relaxed text-white/80">
            {contactItems.map((item, index) => (
              <li key={`${item.text}-${index}`}>
                {item.href ? (
                  <ResumeLink
                    href={item.href}
                    className="text-inherit underline decoration-white/30 underline-offset-2 hover:decoration-white"
                  >
                    {item.text}
                  </ResumeLink>
                ) : (
                  item.text
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSkills && (
        <div className="mt-5">
          <SkillsSection data={data} template={template} sectionId="skills" asList />
        </div>
      )}

      {showLanguages && (
        <div className="mt-5">
          <LanguagesSection data={data} template={template} sectionId="languages" asList />
        </div>
      )}
    </aside>
  )
}
