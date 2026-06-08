import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { migrateResumeData } from './migrate'
import type { ResumeData } from '../types/resume'

export function encodeResumeToUrl(data: ResumeData): string {
  const json = JSON.stringify(data)
  return compressToEncodedURIComponent(json)
}

export function decodeResumeFromUrl(hash: string): ResumeData | null {
  try {
    const json = decompressFromEncodedURIComponent(hash)
    if (!json) return null
    return migrateResumeData(JSON.parse(json))
  } catch {
    return null
  }
}
