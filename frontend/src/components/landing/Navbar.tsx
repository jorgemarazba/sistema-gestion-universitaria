import { Search } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/aspirante', label: 'Aspirante', end: false },
  { to: '/estudiante', label: 'Estudiante', end: false },
  { to: '/egresado', label: 'Egresado', end: false },
  { to: '/profesor', label: 'Profesor', end: false },
] as const

const navClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white'
const navActiveClass = 'bg-white/15 text-white'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b0f1a]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex flex-1 flex-wrap items-center justify-center gap-1 sm:gap-2 lg:justify-start">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${navClass} ${isActive ? navActiveClass : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          <a href="/#pricing" className={navClass}>
            Pricing
          </a>
        </nav>

        <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
          <div className="relative flex min-w-0 flex-1 items-center sm:max-w-[220px] lg:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
              aria-hidden
            />
            <input
              id="search"
              name="search"
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-full border border-slate-700 bg-slate-900/80 py-2 pl-10 pr-4 text-sm text-white outline-none ring-violet-500/30 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2"
              aria-label="Buscar en el sitio"
            />
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/50 bg-blue-950/40 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-900/50 hover:text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/solicitar-cuenta"
            className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500"
          >
            Solicitar cuenta
          </Link>
        </div>
      </div>
    </header>
  )
}
