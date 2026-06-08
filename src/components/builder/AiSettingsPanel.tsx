import { useState } from 'react'
import { Bot } from 'lucide-react'
import {
  getOpenAiKey,
  getOpenAiModel,
  hasOpenAiKey,
  setOpenAiKey,
  setOpenAiModel,
} from '../../utils/aiRewrite'

export function AiSettingsPanel() {
  const [key, setKey] = useState(getOpenAiKey())
  const [model, setModel] = useState(getOpenAiModel())
  const [saved, setSaved] = useState(false)

  const save = () => {
    setOpenAiKey(key)
    setOpenAiModel(model)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a27] p-4">
      <div className="flex items-center gap-2">
        <Bot size={16} className="text-violet-400" />
        <span className="text-sm font-semibold text-slate-300">AI Rewrite (optional)</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Add your OpenAI API key for GPT-powered summary and bullet rewrites. Stored locally only.
        {!hasOpenAiKey() && ' Without a key, rule-based rewrite is used.'}
      </p>
      <div className="mt-3 space-y-2">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          className="w-full rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
        />
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="gpt-4o-mini"
          className="w-full rounded-lg border border-white/10 bg-[#0f0f18] px-3 py-2 text-sm text-slate-300 outline-none focus:border-violet-500"
        />
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500"
        >
          {saved ? 'Saved' : 'Save AI settings'}
        </button>
      </div>
    </div>
  )
}
