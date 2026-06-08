import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  defaultResumeData,
  emptyCustomSection,
  emptyCoverLetter,
  sampleResumeData,
  type ResumeData,
  type ResumeSettings,
  type ResumeSnapshot,
} from '../types/resume'
import type { CoverLetterData } from '../types/resume'
import { mergeSkillsIntoCategories } from '../utils/skills'
import { migrateResumeData } from '../utils/migrate'
import { importResumeFile as parseResumeFile, importTextContent } from '../utils/importResume'
import { exportPdf } from '../utils/exportPdf'
import { exportDocx } from '../utils/exportDocx'
import { exportCoverLetterDocx } from '../utils/exportCoverLetterDocx'
import {
  exportCoverLetterPdf,
  exportResumeAndCoverLetterPdf,
} from '../utils/exportTextPdf'
import {
  buildCleanViewPath,
  buildViewUrl,
  createShareId,
} from '../utils/shareStorage'
import {
  addSnapshot,
  deleteSnapshot as removeSnapshot,
  loadSnapshots,
} from '../utils/snapshotStorage'
import {
  loadMultiResumeState,
  saveMultiResumeState,
  createDefaultMultiResumeState,
  emptyJobTarget,
  type JobTarget,
  type MultiResumeState,
} from '../utils/multiResumeStorage'
import { exportApplicationKitZip, exportApplicationPdf } from '../utils/exportApplicationKit'

const LEGACY_STORAGE_KEY = 'resume-builder-data'
const MAX_HISTORY = 50

interface HistoryState {
  history: ResumeData[]
  index: number
}

export interface SavedResumeSummary {
  id: string
  name: string
  updatedAt: string
}

interface ResumeContextValue {
  resume: ResumeData
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>
  updateResume: (updates: Partial<ResumeData>) => void
  updateSettings: (updates: Partial<ResumeSettings>) => void
  loadSample: () => void
  resetResume: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  exportJson: () => void
  exportPdfFile: () => Promise<void>
  exportCombinedPdfFile: () => Promise<void>
  exportCoverLetterPdfFile: () => Promise<void>
  exportCoverLetterDocxFile: () => Promise<void>
  exportDocxFile: () => Promise<void>
  getShareUrl: () => string
  getSharePath: () => string
  copyShareLink: () => Promise<boolean>
  loadFromShare: (data: ResumeData) => void
  addSkills: (skills: string[]) => void
  snapshots: ResumeSnapshot[]
  saveSnapshot: (name: string) => void
  restoreSnapshot: (id: string) => void
  deleteSnapshot: (id: string) => void
  updateCoverLetter: (updates: Partial<CoverLetterData>) => void
  importJson: (file: File) => Promise<void>
  importResumeFile: (file: File) => Promise<void>
  importPastedText: (text: string) => void
  startFromScratch: () => void
  toggleSectionVisibility: (id: string) => void
  moveSection: (id: string, direction: 'up' | 'down') => void
  reorderSection: (fromIndex: number, toIndex: number) => void
  addCustomSection: (title?: string) => void
  removeCustomSection: (id: string) => void
  savedResumes: SavedResumeSummary[]
  activeResumeId: string
  createNewResumeSlot: (name?: string) => void
  switchResume: (id: string) => void
  deleteResumeSlot: (id: string) => void
  renameResumeSlot: (id: string, name: string) => void
  jobTarget: JobTarget
  updateJobTarget: (updates: Partial<JobTarget>) => void
  exportApplicationKitZipFile: (options?: { includeReferences?: boolean }) => Promise<void>
  exportApplicationKitPdfFile: () => void
  lastSavedAt: Date | null
  isSaving: boolean
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

function loadLegacyResume(): ResumeData | null {
  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (stored) return migrateResumeData(JSON.parse(stored))
  } catch {
    // ignore
  }
  return null
}

function initMultiState(): MultiResumeState {
  const existing = loadMultiResumeState()
  if (existing) return existing

  const legacy = loadLegacyResume()
  const state = createDefaultMultiResumeState(legacy ? 'My Resume' : 'My Resume')
  if (legacy) {
    const id = state.activeId
    state.resumes[id] = {
      name: 'My Resume',
      data: legacy,
      updatedAt: new Date().toISOString(),
      jobTarget: emptyJobTarget(),
    }
  }
  saveMultiResumeState(state)
  return state
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [multiState, setMultiState] = useState<MultiResumeState>(initMultiState)
  const multiRef = useRef(multiState)
  multiRef.current = multiState
  const shareIdsRef = useRef<Record<string, string>>({})

  const activeData =
    multiState.resumes[multiState.activeId]?.data ?? defaultResumeData()

  const [{ history, index }, setHistoryState] = useState<HistoryState>(() => ({
    history: [activeData],
    index: 0,
  }))

  const [snapshots, setSnapshots] = useState<ResumeSnapshot[]>(() =>
    loadSnapshots(multiState.activeId),
  )
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(() => new Date())
  const [isSaving, setIsSaving] = useState(false)

  const resume = history[index]

  const refreshSnapshots = useCallback((slotId: string) => {
    setSnapshots(loadSnapshots(slotId))
  }, [])

  const getShareIdForActive = useCallback(() => {
    const slotId = multiRef.current.activeId
    if (!shareIdsRef.current[slotId]) {
      shareIdsRef.current[slotId] = createShareId()
    }
    return shareIdsRef.current[slotId]
  }, [])

  const persistMulti = useCallback((data: ResumeData) => {
    setIsSaving(true)
    setMultiState((prev) => {
      const activeId = prev.activeId
      const entry = prev.resumes[activeId]
      if (!entry) return prev

      const next: MultiResumeState = {
        ...prev,
        resumes: {
          ...prev.resumes,
          [activeId]: {
            ...entry,
            data,
            updatedAt: new Date().toISOString(),
          },
        },
      }
      saveMultiResumeState(next)
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(data))
      setLastSavedAt(new Date())
      setIsSaving(false)
      return next
    })
  }, [])

  const pushState = useCallback(
    (next: ResumeData) => {
      setHistoryState(({ history: prev, index: prevIndex }) => {
        const trimmed = prev.slice(0, prevIndex + 1)
        trimmed.push(next)
        while (trimmed.length > MAX_HISTORY) trimmed.shift()
        return { history: trimmed, index: trimmed.length - 1 }
      })
      persistMulti(next)
    },
    [persistMulti],
  )

  const setResume: React.Dispatch<React.SetStateAction<ResumeData>> = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(history[index]) : updater
      pushState(next)
    },
    [history, index, pushState],
  )

  const updateResume = (updates: Partial<ResumeData>) => {
    setResume((prev) => ({ ...prev, ...updates }))
  }

  const updateSettings = (updates: Partial<ResumeSettings>) => {
    setResume((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }))
  }

  const loadSample = () => pushState(sampleResumeData())
  const resetResume = () => pushState(defaultResumeData())
  const loadFromShare = useCallback((data: ResumeData) => pushState(data), [pushState])

  const undo = () => {
    setHistoryState(({ history: h, index: i }) => {
      if (i <= 0) return { history: h, index: i }
      const nextIndex = i - 1
      persistMulti(h[nextIndex])
      return { history: h, index: nextIndex }
    })
  }

  const redo = () => {
    setHistoryState(({ history: h, index: i }) => {
      if (i >= h.length - 1) return { history: h, index: i }
      const nextIndex = i + 1
      persistMulti(h[nextIndex])
      return { history: h, index: nextIndex }
    })
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.personalInfo.fullName || 'resume'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updateCoverLetter = (updates: Partial<CoverLetterData>) => {
    setResume((prev) => ({
      ...prev,
      coverLetter: { ...(prev.coverLetter ?? emptyCoverLetter()), ...updates },
    }))
  }

  const addSkills = (skills: string[]) => {
    if (skills.length === 0) return
    setResume((prev) => ({
      ...prev,
      skillCategories: mergeSkillsIntoCategories(prev.skillCategories, skills),
    }))
  }

  const exportPdfFile = async () => {
    await exportPdf(resume, `${resume.personalInfo.fullName || 'resume'}.pdf`)
  }

  const exportCombinedPdfFile = async () => {
    exportResumeAndCoverLetterPdf(resume, `${resume.personalInfo.fullName || 'application'}.pdf`)
  }

  const exportCoverLetterPdfFile = async () => {
    exportCoverLetterPdf(
      resume,
      resume.coverLetter ?? emptyCoverLetter(),
      `${resume.personalInfo.fullName || 'cover'}-letter.pdf`,
    )
  }

  const exportCoverLetterDocxFile = async () => {
    await exportCoverLetterDocx(
      resume,
      resume.coverLetter ?? emptyCoverLetter(),
      `${resume.personalInfo.fullName || 'cover'}-letter.docx`,
    )
  }

  const exportDocxFile = async () => {
    await exportDocx(resume, `${resume.personalInfo.fullName || 'resume'}.docx`)
  }

  const getSharePath = () => buildCleanViewPath(getShareIdForActive())

  const getShareUrl = () => `${window.location.origin}${getSharePath()}`

  const copyShareLink = async () => {
    try {
      const id = getShareIdForActive()
      const url = buildViewUrl(id, resume)
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }

  const saveSnapshot = (name: string) => {
    const slotId = multiRef.current.activeId
    addSnapshot(slotId, name.trim() || `Snapshot ${snapshots.length + 1}`, resume)
    refreshSnapshots(slotId)
  }

  const restoreSnapshot = (snapshotId: string) => {
    const slotId = multiRef.current.activeId
    const snapshot = loadSnapshots(slotId).find((s) => s.id === snapshotId)
    if (snapshot) pushState(snapshot.data)
  }

  const deleteSnapshot = (snapshotId: string) => {
    const slotId = multiRef.current.activeId
    removeSnapshot(slotId, snapshotId)
    refreshSnapshots(slotId)
  }

  const importResumeFile = async (file: File) => {
    pushState(await parseResumeFile(file))
  }

  const importPastedText = (text: string) => {
    pushState(importTextContent(text))
  }

  const importJson = importResumeFile
  const startFromScratch = () => pushState(defaultResumeData())

  const toggleSectionVisibility = (id: string) => {
    setResume((prev) => {
      const hidden = prev.settings.hiddenSections
      const isHidden = hidden.includes(id)
      return {
        ...prev,
        settings: {
          ...prev.settings,
          hiddenSections: isHidden ? hidden.filter((s) => s !== id) : [...hidden, id],
        },
      }
    })
  }

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setResume((prev) => {
      const order = [...prev.settings.sectionOrder]
      const idx = order.indexOf(id)
      if (idx === -1) return prev
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= order.length) return prev
      ;[order[idx], order[swapIdx]] = [order[swapIdx], order[idx]]
      return {
        ...prev,
        settings: { ...prev.settings, sectionOrder: order },
      }
    })
  }

  const reorderSection = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setResume((prev) => {
      const order = [...prev.settings.sectionOrder]
      if (fromIndex < 0 || fromIndex >= order.length) return prev
      if (toIndex < 0 || toIndex >= order.length) return prev
      const [item] = order.splice(fromIndex, 1)
      order.splice(toIndex, 0, item)
      return {
        ...prev,
        settings: { ...prev.settings, sectionOrder: order },
      }
    })
  }

  const addCustomSection = (title?: string) => {
    setResume((prev) => {
      const section = emptyCustomSection(title)
      return {
        ...prev,
        customSections: [...prev.customSections, section],
        settings: {
          ...prev.settings,
          sectionOrder: [...prev.settings.sectionOrder, section.id],
        },
      }
    })
  }

  const removeCustomSection = (id: string) => {
    setResume((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id),
      settings: {
        ...prev.settings,
        sectionOrder: prev.settings.sectionOrder.filter((s) => s !== id),
        hiddenSections: prev.settings.hiddenSections.filter((s) => s !== id),
      },
    }))
  }

  const createNewResumeSlot = (name = 'Untitled Resume') => {
    const id = crypto.randomUUID()
    const data = defaultResumeData()
    setMultiState((prev) => {
      const next: MultiResumeState = {
        activeId: id,
        resumes: {
          ...prev.resumes,
          [id]: {
            name,
            data,
            updatedAt: new Date().toISOString(),
            jobTarget: emptyJobTarget(),
          },
        },
      }
      saveMultiResumeState(next)
      return next
    })
    setHistoryState({ history: [data], index: 0 })
    refreshSnapshots(id)
  }

  const switchResume = (id: string) => {
    const entry = multiRef.current.resumes[id]
    if (!entry) return
    setMultiState((prev) => {
      const next = { ...prev, activeId: id }
      saveMultiResumeState(next)
      return next
    })
    setHistoryState({ history: [entry.data], index: 0 })
    refreshSnapshots(id)
  }

  const deleteResumeSlot = (id: string) => {
    setMultiState((prev) => {
      const keys = Object.keys(prev.resumes)
      if (keys.length <= 1) return prev

      const { [id]: _, ...rest } = prev.resumes
      const activeId = id === prev.activeId ? Object.keys(rest)[0] : prev.activeId
      const next: MultiResumeState = { activeId, resumes: rest }
      saveMultiResumeState(next)

      if (id === prev.activeId) {
        const data = rest[activeId].data
        setHistoryState({ history: [data], index: 0 })
      }
      return next
    })
  }

  const renameResumeSlot = (id: string, name: string) => {
    setMultiState((prev) => {
      const entry = prev.resumes[id]
      if (!entry) return prev
      const next: MultiResumeState = {
        ...prev,
        resumes: {
          ...prev.resumes,
          [id]: { ...entry, name },
        },
      }
      saveMultiResumeState(next)
      return next
    })
  }

  const updateJobTarget = (updates: Partial<JobTarget>) => {
    setMultiState((prev) => {
      const activeId = prev.activeId
      const entry = prev.resumes[activeId]
      if (!entry) return prev
      const next: MultiResumeState = {
        ...prev,
        resumes: {
          ...prev.resumes,
          [activeId]: {
            ...entry,
            jobTarget: { ...emptyJobTarget(), ...entry.jobTarget, ...updates },
            updatedAt: new Date().toISOString(),
          },
        },
      }
      saveMultiResumeState(next)
      return next
    })
  }

  const exportApplicationKitZipFile = async (options?: { includeReferences?: boolean }) => {
    await exportApplicationKitZip(resume, resume.coverLetter, options)
  }

  const exportApplicationKitPdfFile = () => {
    exportApplicationPdf(resume)
  }

  const jobTarget =
    multiState.resumes[multiState.activeId]?.jobTarget ?? emptyJobTarget()

  const savedResumes: SavedResumeSummary[] = Object.entries(multiState.resumes).map(
    ([id, entry]) => ({
      id,
      name: entry.name,
      updatedAt: entry.updatedAt,
    }),
  )

  return (
    <ResumeContext.Provider
      value={{
        resume,
        setResume,
        updateResume,
        updateSettings,
        loadSample,
        resetResume,
        undo,
        redo,
        canUndo: index > 0,
        canRedo: index < history.length - 1,
        exportJson,
        exportPdfFile,
        exportCombinedPdfFile,
        exportCoverLetterPdfFile,
        exportCoverLetterDocxFile,
        exportDocxFile,
        getShareUrl,
        getSharePath,
        copyShareLink,
        loadFromShare,
        addSkills,
        snapshots,
        saveSnapshot,
        restoreSnapshot,
        deleteSnapshot,
        updateCoverLetter,
        importJson,
        importResumeFile,
        importPastedText,
        startFromScratch,
        toggleSectionVisibility,
        moveSection,
        reorderSection,
        addCustomSection,
        removeCustomSection,
        savedResumes,
        activeResumeId: multiState.activeId,
        createNewResumeSlot,
        switchResume,
        deleteResumeSlot,
        renameResumeSlot,
        jobTarget,
        updateJobTarget,
        exportApplicationKitZipFile,
        exportApplicationKitPdfFile,
        lastSavedAt,
        isSaving,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
