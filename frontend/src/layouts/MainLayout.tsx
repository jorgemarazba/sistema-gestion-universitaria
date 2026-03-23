import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/landing/Navbar'
import { LogoBar } from '../components/landing/LogoBar'
import { SiteFooter } from '../components/landing/SiteFooter'

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-left text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Navbar />
      <LogoBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
