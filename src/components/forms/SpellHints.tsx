import { checkSpelling } from '../../utils/spellCheck'

export function SpellHints({ text }: { text: string }) {
  const issues = checkSpelling(text)
  if (issues.length === 0) return null

  return (
    <p className="mt-1.5 text-xs text-amber-400">
      Possible spelling issues: {issues.slice(0, 5).join(', ')}
      {issues.length > 5 ? ` (+${issues.length - 5} more)` : ''}
    </p>
  )
}
