export type ApplicationStatus = 'applied' | 'interview' | 'rejected' | 'offer' | 'withdrawn'

export interface JobApplication {
  id: string
  company: string
  role: string
  dateApplied: string
  status: ApplicationStatus
  resumeSlotId?: string
  resumeSlotName?: string
  snapshotName?: string
  jobTitle?: string
  notes?: string
}

const STORAGE_KEY = 'resume-builder-applications'

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  interview: 'Interview',
  rejected: 'Rejected',
  offer: 'Offer',
  withdrawn: 'Withdrawn',
}

export function loadApplications(): JobApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as JobApplication[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveApplications(apps: JobApplication[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

export function addApplication(app: Omit<JobApplication, 'id'>): JobApplication {
  const entry: JobApplication = { ...app, id: crypto.randomUUID() }
  const apps = loadApplications()
  apps.unshift(entry)
  saveApplications(apps)
  return entry
}

export function updateApplication(id: string, updates: Partial<JobApplication>): void {
  const apps = loadApplications().map((a) => (a.id === id ? { ...a, ...updates } : a))
  saveApplications(apps)
}

export function deleteApplication(id: string): void {
  saveApplications(loadApplications().filter((a) => a.id !== id))
}
