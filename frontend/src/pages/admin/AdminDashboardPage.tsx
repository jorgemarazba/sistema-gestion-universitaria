import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard,
  Bell,
  Users,
  Settings,
  LogOut,
  Search,
} from 'lucide-react'

interface Solicitud {
  id_usuario: string
  nombre: string
  apellido: string
  correoPersonal: string
  correoInstitucional: string | null
  documentoIdentidad: string
  rol: string
  motivoSolicitud: string | null
  comprobanteUrl: string | null
  fechaRegistro: string
}

interface Estadisticas {
  pendientes: number
  aprobadosHoy: number
  rechazados: number
  activos: number
}

export function AdminDashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [filtroCorreo, setFiltroCorreo] = useState('')
  const [loading, setLoading] = useState(true)
  const [rechazarModal, setRechazarModal] = useState<{
    id: string
    nombre: string
  } | null>(null)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [aprobarModal, setAprobarModal] = useState<{
    id: string
    nombre: string
  } | null>(null)
  const [correoInstitucional, setCorreoInstitucional] = useState('')
  const [docPreview, setDocPreview] = useState<string | null>(null)
  const [accionando, setAccionando] = useState<string | null>(null)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      const [solRes, statsRes] = await Promise.all([
        api.get<{ data: Solicitud[] }>(
          `/usuarios/pendientes${filtroCorreo ? `?correo=${encodeURIComponent(filtroCorreo)}` : ''}`,
        ),
        api.get<{ data: Estadisticas }>('/usuarios/estadisticas'),
      ])
      setSolicitudes(solRes.data.data ?? solRes.data)
      setEstadisticas(statsRes.data.data ?? statsRes.data)
    } catch {
      setSolicitudes([])
      setEstadisticas(null)
    } finally {
      setLoading(false)
    }
  }, [filtroCorreo])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAprobar = async () => {
    if (!aprobarModal || !correoInstitucional.trim()) return
    try {
      setAccionando(aprobarModal.id)
      const res = await api.patch<{ data: { passwordTemporal?: string } }>(
        `/usuarios/${aprobarModal.id}/aprobar`,
        { correo_institucional: correoInstitucional.trim() },
      )
      const data = res.data.data ?? res.data
      const pass = (data as { passwordTemporal?: string }).passwordTemporal
      alert(
        pass
          ? `Aprobado. Comparte con el usuario: Correo: ${correoInstitucional.trim()}\nContraseña temporal: ${pass}`
          : 'Solicitud aprobada',
      )
      setAprobarModal(null)
      setCorreoInstitucional('')
      cargarDatos()
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { message?: string } } }
      alert(axErr.response?.data?.message ?? 'Error al aprobar')
    } finally {
      setAccionando(null)
    }
  }

  const handleRechazar = async () => {
    if (!rechazarModal || motivoRechazo.trim().length < 5) {
      alert('Indica el motivo del rechazo (mínimo 5 caracteres)')
      return
    }
    try {
      setAccionando(rechazarModal.id)
      await api.patch(`/usuarios/${rechazarModal.id}/rechazar`, {
        motivo_rechazo: motivoRechazo.trim(),
      })
      alert('Solicitud rechazada')
      setRechazarModal(null)
      setMotivoRechazo('')
      cargarDatos()
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { message?: string } } }
      alert(axErr.response?.data?.message ?? 'Error al rechazar')
    } finally {
      setAccionando(null)
    }
  }

  const pendientesCount = estadisticas?.pendientes ?? 0

  useEffect(() => {
    if (user && user.rol !== 'administrador') {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  if (!user) {
    return null
  }
  if (user.rol !== 'administrador') {
    return null
  }

  return (
    <div className="flex min-h-svh bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-slate-900 p-6 text-white">
        <h2 className="mb-8 text-2xl font-bold">AdminPanel</h2>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-violet-600 px-4 py-2.5 transition hover:bg-violet-500"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-between rounded-lg px-4 py-2.5 transition hover:bg-slate-800"
          >
            <span className="flex items-center gap-3">
              <Bell size={20} />
              Solicitudes
            </span>
            {pendientesCount > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">
                {pendientesCount}
              </span>
            )}
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 transition hover:bg-slate-800"
          >
            <Users size={20} />
            Usuarios
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 transition hover:bg-slate-800"
          >
            <Settings size={20} />
            Configuración
          </a>
        </nav>
        <div className="mt-auto border-t border-slate-700 pt-6">
          <div className="mb-2 text-sm text-slate-400">{user?.nombre}</div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Centro de Verificaciones
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Revisa y aprueba las solicitudes de correos institucionales.
          </p>
        </header>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border-l-4 border-violet-500 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-violet-500">
            <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
              Total pendientes
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {estadisticas?.pendientes ?? '—'}
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-green-500">
            <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
              Aprobados
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {estadisticas?.activos ?? '—'}
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-red-500 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-red-500">
            <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
              Rechazados
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {estadisticas?.rechazados ?? '—'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Buscar por correo..."
              value={filtroCorreo}
              onChange={(e) => setFiltroCorreo(e.target.value)}
              className="w-full max-w-md rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Cargando solicitudes...
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                ¡Buen trabajo!
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                No hay solicitudes pendientes de revisión.
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Correo personal
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Documento
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {solicitudes.map((s) => (
                  <tr
                    key={s.id_usuario}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {s.nombre} {s.apellido}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Solicita rol: {s.rol === 'docente' ? 'Profesor' : 'Estudiante'}
                      </div>
                    </td>
                    <td className="px-6 py-4 italic text-slate-600 dark:text-slate-300">
                      {s.correoPersonal}
                    </td>
                    <td className="px-6 py-4">
                      {s.comprobanteUrl ? (
                        <button
                          type="button"
                          onClick={() => setDocPreview(s.comprobanteUrl)}
                          className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
                        >
                          Ver documento
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setAprobarModal({
                              id: s.id_usuario,
                              nombre: `${s.nombre} ${s.apellido}`,
                            })
                          }
                          disabled={!!accionando}
                          className="rounded-lg bg-green-100 px-4 py-2 text-sm font-bold text-green-700 transition hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRechazarModal({
                              id: s.id_usuario,
                              nombre: `${s.nombre} ${s.apellido}`,
                            })
                          }
                          disabled={!!accionando}
                          className="rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Link
          to="/"
          className="mt-8 inline-block text-sm text-violet-600 hover:underline dark:text-violet-400"
        >
          ← Volver al inicio
        </Link>
      </main>

      {/* Modal Aprobar */}
      {aprobarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !accionando && setAprobarModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="aprobar-title"
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="aprobar-title" className="text-lg font-bold text-slate-800 dark:text-white">
              Aprobar solicitud de {aprobarModal.nombre}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Asigna el correo institucional para este usuario:
            </p>
            <input
              type="email"
              placeholder="usuario@universidad.edu"
              value={correoInstitucional}
              onChange={(e) => setCorreoInstitucional(e.target.value)}
              className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAprobarModal(null)}
                disabled={!!accionando}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAprobar}
                disabled={!correoInstitucional.trim() || !!accionando}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500 disabled:opacity-50"
              >
                {accionando === aprobarModal.id ? 'Procesando…' : 'Aprobar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rechazar */}
      {rechazarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !accionando && setRechazarModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rechazar-title"
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="rechazar-title" className="text-lg font-bold text-slate-800 dark:text-white">
              Rechazar solicitud de {rechazarModal.nombre}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Indica el motivo (se notificará al usuario):
            </p>
            <textarea
              placeholder="Ej: El correo no coincide con el dominio permitido"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              rows={4}
              className="mt-4 w-full resize-none rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRechazarModal(null)}
                disabled={!!accionando}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRechazar}
                disabled={motivoRechazo.trim().length < 5 || !!accionando}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {accionando === rechazarModal.id ? 'Procesando…' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Documento */}
      {docPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDocPreview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-[90vh] max-w-2xl overflow-auto rounded-xl bg-white p-4 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white">
                Vista previa
              </h3>
              <button
                type="button"
                onClick={() => setDocPreview(null)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <iframe
              src={docPreview}
              title="Documento"
              className="mt-4 h-96 w-full rounded border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  )
}
