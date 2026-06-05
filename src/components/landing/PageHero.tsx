import type { ReactNode } from 'react'

interface PageHeroProps {
  badge?: string
  title: string
  subtitle: string
  children?: ReactNode
}

export function PageHero({ badge, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 px-5 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.15)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        {badge && (
          <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            {badge}
          </span>
        )}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          {subtitle}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
