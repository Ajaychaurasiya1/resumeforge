import { useEffect, useState } from 'react'
import { useResume } from '../../context/ResumeContext'

function formatSavedTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function AutoSaveIndicator() {
  const { lastSavedAt, isSaving } = useResume()
  const [, tick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 15000)
    return () => clearInterval(id)
  }, [])

  if (!lastSavedAt) return null

  return (
    <span
      className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs sm:inline-flex ${
        isSaving
          ? 'border-amber-500/30 text-amber-400'
          : 'border-emerald-500/20 text-emerald-400/90'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isSaving ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`}
      />
      {isSaving ? 'Saving…' : `Saved · ${formatSavedTime(lastSavedAt)}`}
    </span>
  )
}
