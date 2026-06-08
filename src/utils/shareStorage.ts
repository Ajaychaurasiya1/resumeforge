import { migrateResumeData } from './migrate'
import { encodeResumeToUrl, decodeResumeFromUrl } from './shareResume'
import type { ResumeData } from '../types/resume'

const STORAGE_KEY = 'resume-forge-public-shares'

interface ShareEntry {
  data: ResumeData
  createdAt: string
}

type ShareRegistry = Record<string, ShareEntry>

function loadRegistry(): ShareRegistry {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ShareRegistry
  } catch {
    return {}
  }
}

function saveRegistry(registry: ShareRegistry): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry))
}

export function createShareId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export function publishShare(id: string, data: ResumeData): void {
  const registry = loadRegistry()
  registry[id] = {
    data: migrateResumeData(data),
    createdAt: new Date().toISOString(),
  }
  saveRegistry(registry)
}

export function loadPublishedShare(id: string): ResumeData | null {
  const entry = loadRegistry()[id]
  return entry ? migrateResumeData(entry.data) : null
}

export function buildViewUrl(id: string, data: ResumeData, origin = window.location.origin): string {
  publishShare(id, data)
  const encoded = encodeResumeToUrl(data)
  return `${origin}/view/${id}?d=${encoded}`
}

export function buildCleanViewPath(id: string): string {
  return `/view/${id}`
}

export function resolveSharedResume(id: string, encodedFallback?: string | null): ResumeData | null {
  const local = loadPublishedShare(id)
  if (local) return local
  if (encodedFallback) return decodeResumeFromUrl(encodedFallback)
  return null
}
