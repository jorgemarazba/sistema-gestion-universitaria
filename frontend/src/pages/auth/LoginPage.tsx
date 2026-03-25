import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import {
  loginSchema,
  loginDefaultValues,
  type LoginFormValues,
} from './login.schema'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: 'onTouched',
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post<{
        success: boolean
        data: {
          access_token: string
          user: { nombre: string; rol: string; email: string }
        }
      }>('/auth/login', {
        correo: data.correo,
        contrasena: data.contrasena,
      })

      const { access_token, user } = response.data.data
      setAuth(access_token, user)
      alert(`¡Bienvenido ${user.nombre}!`)
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { message?: string; error?: string | { message?: string } } } }
      const msg =
        axErr.response?.data?.message ??
        (typeof axErr.response?.data?.error === 'string'
          ? axErr.response.data.error
          : axErr.response?.data?.error?.message)
      console.error('Login error:', axErr.response?.data ?? err)
      alert(msg ?? 'Error al iniciar sesión')
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#070b14] px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(139 92 246 / 0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgb(59 130 246 / 0.2), transparent)',
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Volver al inicio
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Accede con tu correo y contraseña institucionales
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-md md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="login-correo"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                  aria-hidden
                />
                <input
                  id="login-correo"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nombre@institucion.edu"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none ring-violet-500/0 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                  aria-invalid={errors.correo ? 'true' : 'false'}
                  aria-describedby={errors.correo ? 'login-correo-error' : undefined}
                  {...register('correo')}
                />
              </div>
              {errors.correo && (
                <p
                  id="login-correo-error"
                  role="alert"
                  className="mt-1.5 text-xs text-red-400"
                >
                  {errors.correo.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-contrasena"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                  aria-hidden
                />
                <input
                  id="login-contrasena"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/50 py-2.5 pl-10 pr-12 text-sm text-white outline-none ring-violet-500/0 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                  aria-invalid={errors.contrasena ? 'true' : 'false'}
                  aria-describedby={
                    errors.contrasena ? 'login-contrasena-error' : undefined
                  }
                  {...register('contrasena')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.contrasena && (
                <p
                  id="login-contrasena-error"
                  role="alert"
                  className="mt-1.5 text-xs text-red-400"
                >
                  {errors.contrasena.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Entrando…
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Autenticación segura Con tu correo Institucional
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿No tienes cuenta institucional?{' '}
          <Link
            to="/solicitar-cuenta"
            className="font-medium text-violet-400 hover:text-violet-300 hover:underline"
          >
            Solicitar cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}
