import { Outlet } from 'react-router-dom'
import { LandingNav } from './LandingNav'
import { LandingFooter } from './LandingFooter'

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-[#08080f] text-slate-300">
      <LandingNav />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  )
}
