import { migrateResumeData } from './migrate'
import type { ResumeData, ResumeSnapshot } from '../types/resume'

const KEY_PREFIX = 'resume-forge-snapshots-'

function storageKey(resumeSlotId: string): string {
  return `${KEY_PREFIX}${resumeSlotId}`
}

export function loadSnapshots(resumeSlotId: string): ResumeSnapshot[] {
  try {
    const raw = localStorage.getItem(storageKey(resumeSlotId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as ResumeSnapshot[]
    return parsed.map((s) => ({
      ...s,
      data: migrateResumeData(s.data),
    }))
  } catch {
    return []
  }
}

export function saveSnapshots(resumeSlotId: string, snapshots: ResumeSnapshot[]): void {
  localStorage.setItem(storageKey(resumeSlotId), JSON.stringify(snapshots))
}

export function addSnapshot(
  resumeSlotId: string,
  name: string,
  data: ResumeData,
): ResumeSnapshot {
  const snapshots = loadSnapshots(resumeSlotId)
  const snapshot: ResumeSnapshot = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    data: migrateResumeData(data),
  }
  saveSnapshots(resumeSlotId, [snapshot, ...snapshots].slice(0, 20))
  return snapshot
}

export function deleteSnapshot(resumeSlotId: string, snapshotId: string): void {
  const snapshots = loadSnapshots(resumeSlotId).filter((s) => s.id !== snapshotId)
  saveSnapshots(resumeSlotId, snapshots)
}
