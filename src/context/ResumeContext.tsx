import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  defaultResumeData,
  sampleResumeData,
  type ResumeData,
  type ResumeSettings,
  type SectionId,
} from '../types/resume'
import { migrateResumeData } from '../utils/migrate'
import { importResumeFile as parseResumeFile } from '../utils/importResume'

const STORAGE_KEY = 'resume-builder-data'
const MAX_HISTORY = 50

interface HistoryState {
  history: ResumeData[]
  index: number
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
  importJson: (file: File) => Promise<void>
  importResumeFile: (file: File) => Promise<void>
  startFromScratch: () => void
  toggleSectionVisibility: (id: SectionId) => void
  moveSection: (id: SectionId, direction: 'up' | 'down') => void
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

function loadFromStorage(): ResumeData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return migrateResumeData(JSON.parse(stored))
  } catch {
    // ignore corrupt data
  }
  return defaultResumeData()
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [{ history, index }, setHistoryState] = useState<HistoryState>(() => ({
    history: [loadFromStorage()],
    index: 0,
  }))

  const resume = history[index]

  const pushState = useCallback((next: ResumeData) => {
    setHistoryState(({ history: prev, index: prevIndex }) => {
      const trimmed = prev.slice(0, prevIndex + 1)
      trimmed.push(next)
      while (trimmed.length > MAX_HISTORY) trimmed.shift()
      return { history: trimmed, index: trimmed.length - 1 }
    })
  }, [])

  const setResume: React.Dispatch<React.SetStateAction<ResumeData>> = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(history[index]) : updater
      pushState(next)
    },
    [history, index, pushState],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
  }, [resume])

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

  const undo = () => {
    setHistoryState(({ history: h, index: i }) =>
      i > 0 ? { history: h, index: i - 1 } : { history: h, index: i },
    )
  }

  const redo = () => {
    setHistoryState(({ history: h, index: i }) =>
      i < h.length - 1 ? { history: h, index: i + 1 } : { history: h, index: i },
    )
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

  const importResumeFile = async (file: File) => {
    pushState(await parseResumeFile(file))
  }

  const importJson = importResumeFile
  const startFromScratch = () => pushState(defaultResumeData())

  const toggleSectionVisibility = (id: SectionId) => {
    setResume((prev) => {
      const hidden = prev.settings.hiddenSections
      const isHidden = hidden.includes(id)
      return {
        ...prev,
        settings: {
          ...prev.settings,
          hiddenSections: isHidden
            ? hidden.filter((s) => s !== id)
            : [...hidden, id],
        },
      }
    })
  }

  const moveSection = (id: SectionId, direction: 'up' | 'down') => {
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
        importJson,
        importResumeFile,
        startFromScratch,
        toggleSectionVisibility,
        moveSection,
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
