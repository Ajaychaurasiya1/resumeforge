import { defaultResumeData, type ResumeData } from '../types/resume'
import { migrateResumeData } from './migrate'

const STORAGE_KEY = 'resume-builder-multi'

export interface JobTarget {
  jobTitle: string
  jobDescription: string
  companyName: string
  savedKeywords: string[]
}

export interface StoredResume {
  name: string
  data: ResumeData
  updatedAt: string
  jobTarget?: JobTarget
}

export interface MultiResumeState {
  activeId: string
  resumes: Record<string, StoredResume>
}

export function emptyJobTarget(): JobTarget {
  return {
    jobTitle: '',
    jobDescription: '',
    companyName: '',
    savedKeywords: [],
  }
}

export function loadMultiResumeState(): MultiResumeState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as MultiResumeState
    if (!parsed.activeId || !parsed.resumes) return null

    const resumes: Record<string, StoredResume> = {}
    for (const [id, entry] of Object.entries(parsed.resumes)) {
      resumes[id] = {
        name: entry.name ?? 'Untitled Resume',
        data: migrateResumeData(entry.data),
        updatedAt: entry.updatedAt ?? new Date().toISOString(),
        jobTarget: entry.jobTarget
          ? { ...emptyJobTarget(), ...entry.jobTarget }
          : emptyJobTarget(),
      }
    }

    return {
      activeId: parsed.activeId in resumes ? parsed.activeId : Object.keys(resumes)[0] ?? '',
      resumes,
    }
  } catch {
    return null
  }
}

export function saveMultiResumeState(state: MultiResumeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createDefaultMultiResumeState(name = 'My Resume'): MultiResumeState {
  const id = crypto.randomUUID()
  return {
    activeId: id,
    resumes: {
      [id]: {
        name,
        data: defaultResumeData(),
        updatedAt: new Date().toISOString(),
        jobTarget: emptyJobTarget(),
      },
    },
  }
}
