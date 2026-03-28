import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import {
  ClipboardCheck,
  Mail,
  Fingerprint,
  GraduationCap,
  ArrowLeft,
  Loader2,
  Phone,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { solicitudSchema, type SolicitudFormValues } from './SolicitudCuenta.schema'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002/api/v1'

const inputClass =
  'w-full rounded-lg border border-slate-600/80 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25'

export const SolicitudCuentaPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SolicitudFormValues>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: { tipo_usuario: 'estudiante' },
    mode: 'onTouched',
  })

  const onSubmit = async (data: SolicitudFormValues) => {
    try {
      await axios.post(`${API_URL}/usuarios/solicitar-acceso`, data)
      alert(
        'Solicitud enviada con éxito. Revisaremos tus datos y te enviaremos el correo institucional a tu email personal en 24 a 48 horas.',
      )
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error al enviar la solicitud. Intenta de nuevo.'
      alert(msg)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 py-12">
      {/* Fondo: gradiente oscuro + orbes de acento */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 20% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), linear-gradient(180deg, #050810 0%, #0f172a 40%, #0c1222 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-3xl">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/40 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl md:flex-row">
          {/* Panel izquierdo: gradiente cian–violeta */}
          <div
            className="relative flex flex-col justify-center p-8 md:w-2/5"
            style={{
              background:
                'linear-gradient(145deg, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.2) 40%, rgba(139, 92, 246, 0.35) 100%)',
              boxShadow: 'inset 0 0 60px rgba(6, 182, 212, 0.08)',
            }}
          >
            <div className="absolute inset-0 border-r border-white/5" />
            <GraduationCap
              className="mb-6 size-12 text-cyan-300/90"
              strokeWidth={1.5}
            />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Portal de Admisiones
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cyan-100/90">
              Para obtener tu correo institucional y acceso al sistema, completa
              este formulario. Un administrador validará tu identidad en un plazo
              de 24 a 48 horas.
            </p>
          </div>

          {/* Panel derecho: formulario */}
          <div className="relative flex flex-col p-8 md:w-3/5">
            <Link
              to="/login"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
            >
              <ArrowLeft size={16} /> Volver al Login
            </Link>

            <h3 className="mb-6 text-center text-xl font-bold tracking-tight text-white">
              Solicitar credenciales
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Nombre
                  </label>
                  <input
                    {...register('nombre')}
                    className={inputClass}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && (
                    <p className="mt-1.5 text-xs text-rose-400">
                      {errors.nombre.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Apellido
                  </label>
                  <input
                    {...register('apellido')}
                    className={inputClass}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && (
                    <p className="mt-1.5 text-xs text-rose-400">
                      {errors.apellido.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Documento de identidad
                </label>
                <div className="relative">
                  <Fingerprint
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                    aria-hidden
                  />
                  <input
                    {...register('documento_identidad')}
                    className={inputClass}
                    placeholder="Cédula o pasaporte"
                  />
                </div>
                {errors.documento_identidad && (
                  <p className="mt-1.5 text-xs text-rose-400">
                    {errors.documento_identidad.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Correo personal (para notificación)
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                    aria-hidden
                  />
                  <input
                    {...register('correo_personal')}
                    type="email"
                    className={inputClass}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                {errors.correo_personal && (
                  <p className="mt-1.5 text-xs text-rose-400">
                    {errors.correo_personal.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Teléfono de contacto
                </label>
                <div className="relative">
                  <Phone
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                    aria-hidden
                  />
                  <input
                    {...register('telefono')}
                    type="tel"
                    className={inputClass}
                    placeholder="3001234567"
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1.5 text-xs text-rose-400">
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tipo de usuario
                </label>
                <select
                  {...register('tipo_usuario')}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                </select>
                {errors.tipo_usuario && (
                  <p className="mt-1.5 text-xs text-rose-400">
                    {errors.tipo_usuario.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Facultad / motivo de solicitud
                </label>
                <textarea
                  {...register('motivo')}
                  rows={3}
                  className={`${inputClass} resize-none pt-3`}
                  placeholder="Ej: Facultad de Ingeniería - Nuevo ingreso 2026"
                />
                {errors.motivo && (
                  <p className="mt-1.5 text-xs text-rose-400">
                    {errors.motivo.message}
                  </p>
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-violet-500 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden />
                    Enviando…
                  </>
                ) : (
                  <>
                    <ClipboardCheck size={20} aria-hidden />
                    Enviar solicitud
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
