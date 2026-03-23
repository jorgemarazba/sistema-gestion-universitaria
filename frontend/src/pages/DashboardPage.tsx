import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LayoutDashboard } from 'lucide-react'

export function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-svh bg-[#070b14]">
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="size-8 text-violet-500" />
            <h1 className="text-xl font-semibold text-white">Panel de control</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {user?.nombre ?? 'Usuario'} · {user?.rol ?? '-'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-slate-400">
          Bienvenido al dashboard. Aquí podrás gestionar las solicitudes de
          acceso y más.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </main>
    </div>
  )
}
