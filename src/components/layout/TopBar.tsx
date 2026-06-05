import { useRef } from 'react'
import { useResume } from '../../context/ResumeContext'
import { Download, RotateCcw, Sparkles, Undo2, Redo2, Upload, Save } from 'lucide-react'
import type { TemplateId } from '../../types/resume'
import { TEMPLATE_REGISTRY } from '../../templates/registry'

export function TopBar({ dark = false }: { dark?: boolean }) {
  const {
    resume,
    updateResume,
    loadSample,
    resetResume,
    undo,
    redo,
    canUndo,
    canRedo,
    exportJson,
    importResumeFile,
  } = useResume()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePrint = () => window.print()

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await importResumeFile(file)
      e.target.value = ''
    }
  }

  const selectCls = dark
    ? 'rounded-xl border border-white/10 bg-[#1a1a27] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500'
    : 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100'

  const btnCls = dark
    ? 'rounded-xl border border-white/10 bg-[#1a1a27] text-slate-400 hover:text-slate-200'
    : 'rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700'

  const btnTextCls = dark
    ? 'rounded-xl border border-white/10 bg-[#1a1a27] px-3 py-2 text-sm text-slate-400 hover:text-slate-200'
    : 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50'

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <select
        value={resume.template}
        onChange={(e) => updateResume({ template: e.target.value as TemplateId })}
        className={selectCls}
      >
        {TEMPLATE_REGISTRY.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <div className={`flex rounded-xl border ${dark ? 'border-white/10' : 'border-slate-200'}`}>
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
          className={`px-2.5 py-2 disabled:opacity-30 ${btnCls} border-0`}
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
          className={`border-l px-2.5 py-2 disabled:opacity-30 ${btnCls} ${dark ? 'border-white/10' : 'border-slate-200'} border-0 border-l`}
        >
          <Redo2 size={15} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.pdf,.txt,application/json,application/pdf,text/plain"
        onChange={handleImport}
        className="hidden"
      />
      <button onClick={() => fileInputRef.current?.click()} className={`p-2 ${btnCls}`} title="Import resume (JSON, PDF, TXT)">
        <Upload size={15} />
      </button>
      <button onClick={exportJson} className={`p-2 ${btnCls}`} title="Save JSON">
        <Save size={15} />
      </button>
      <button onClick={loadSample} className={`inline-flex items-center gap-1.5 ${btnTextCls}`}>
        <Sparkles size={14} />
        Sample
      </button>
      <button onClick={resetResume} className={`inline-flex items-center gap-1.5 ${btnTextCls}`}>
        <RotateCcw size={14} />
        Reset
      </button>
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
      >
        <Download size={14} />
        Export PDF
      </button>
    </div>
  )
}
