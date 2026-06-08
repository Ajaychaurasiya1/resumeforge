import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { QrCode } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { ExternalUrlLink } from '../templates/ResumeLinks'

export function QrCodePanel() {
  const { getShareUrl, resume } = useResume()
  const [dataUrl, setDataUrl] = useState('')
  const url = resume.personalInfo.portfolio || getShareUrl()

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 160 })
      .then(setDataUrl)
      .catch(() => setDataUrl(''))
  }, [url])

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <QrCode size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">Resume QR Code</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Links to your portfolio or share URL — add to printed resumes or business cards.
      </p>
      <div className="mt-3 flex items-center gap-4">
        {dataUrl ? (
          <img src={dataUrl} alt="QR code for resume link" className="rounded-lg bg-white p-2" />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-white/5 text-xs text-slate-500">
            Generating…
          </div>
        )}
        <ExternalUrlLink
          url={url}
          className="min-w-0 flex-1 break-all text-xs text-violet-400 underline decoration-violet-400/40 underline-offset-2 hover:text-violet-300"
        />
      </div>
    </div>
  )
}
