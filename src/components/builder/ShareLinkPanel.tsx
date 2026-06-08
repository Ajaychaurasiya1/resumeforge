import { useState } from 'react'
import { Check, ExternalLink, Link2, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useResume } from '../../context/ResumeContext'

export function ShareLinkPanel() {
  const { getShareUrl, getSharePath, copyShareLink } = useResume()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await copyShareLink()
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <Share2 size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">Share Read-Only Link</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Clean URL for recruiters at{' '}
        <code className="text-violet-400/80">/view/your-id</code>. Link works on any device.
      </p>

      <div className="mt-3 flex gap-2">
        <a
          href={getShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 truncate rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-xs text-violet-400 underline decoration-violet-400/40 underline-offset-2 hover:text-violet-300"
        >
          {getShareUrl()}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500"
        >
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <Link
        to={getSharePath()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
      >
        <ExternalLink size={12} />
        Preview share page
      </Link>
    </div>
  )
}
