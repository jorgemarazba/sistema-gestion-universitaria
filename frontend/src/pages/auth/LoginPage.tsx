import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail, X, CheckCircle, AlertCircle, GraduationCap, BookOpen, Shield, ChevronLeft } from 'lucide-react'
import {
  loginSchema,
  loginDefaultValues,
  type LoginFormValues,
} from './login.schema'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'

interface Toast {
  type: 'success' | 'error'
  message: string
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
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
          user: { id: string; nombre: string; rol: string; email: string }
        }
      }>('/auth/login', {
        correo: data.correo,
        contrasena: data.contrasena,
      })

      const { access_token, user } = response.data.data
      setAuth(access_token, user)
      setToast({ type: 'success', message: `¡Bienvenido ${user.nombre}!` })
      setTimeout(() => navigate('/admin/dashboard'), 1500)
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { message?: string; error?: string | { message?: string } } } }
      const msg =
        axErr.response?.data?.message ??
        (typeof axErr.response?.data?.error === 'string'
          ? axErr.response.data.error
          : axErr.response?.data?.error?.message)
      console.error('Login error:', axErr.response?.data ?? err)
      setToast({ type: 'error', message: msg ?? 'Error al iniciar sesión' })
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row overflow-hidden bg-[#0a0f1c]">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all border ${
          toast.type === 'success' 
            ? 'bg-emerald-500/95 border-emerald-400/30 text-white' 
            : 'bg-red-500/95 border-red-400/30 text-white'
        }`}>
          <div className="p-1.5 bg-white/20 rounded-full">
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          </div>
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-1 hover:bg-white/20 rounded-full transition">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Left Side - University Branding */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-blue-900 to-slate-900" />
        
        {/* Decorative pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <GraduationCap className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">EduManager</h2>
              <p className="text-sm text-blue-200/80">Sistema de Gestión Universitaria</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/90">Plataforma segura institucional</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Bienvenido al <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-amber-500">portal académico</span>
            </h1>
            
            <p className="text-lg text-blue-100/80 leading-relaxed mb-8">
              Accede a tu información académica, gestiona tus cursos, consulta calificaciones y mantente conectado con tu comunidad universitaria.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <BookOpen className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-blue-200/70">Programas</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <GraduationCap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">10k+</div>
                <div className="text-xs text-blue-200/70">Estudiantes</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Shield className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-blue-200/70">Soporte</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-blue-200/60">
            © 2025 EduManager. Todos los derechos reservados.
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-amber-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 xl:p-16 bg-[#0a0f1c] relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/50 to-[#0a0f1c]" />
        
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-3 z-20">
          <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">EduManager</h2>
          </div>
        </div>

        <div className="relative w-full max-w-md">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
            Volver al inicio
          </Link>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Iniciar sesión
            </h1>
            <p className="text-slate-400">
              Ingresa tus credenciales institucionales para continuar
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 sm:p-8 shadow-2xl shadow-black/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="login-correo"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Correo institucional
                </label>
                <div className="relative group">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition"
                    aria-hidden
                  />
                  <input
                    id="login-correo"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu.nombre@institucion.edu"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-600"
                    aria-invalid={errors.correo ? 'true' : 'false'}
                    aria-describedby={errors.correo ? 'login-correo-error' : undefined}
                    {...register('correo')}
                  />
                </div>
                {errors.correo && (
                  <p
                    id="login-correo-error"
                    role="alert"
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.correo.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="login-contrasena"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition"
                    aria-hidden
                  />
                  <input
                    id="login-contrasena"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-600"
                    aria-invalid={errors.contrasena ? 'true' : 'false'}
                    aria-describedby={
                      errors.contrasena ? 'login-contrasena-error' : undefined
                    }
                    {...register('contrasena')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.contrasena && (
                  <p
                    id="login-contrasena-error"
                    role="alert"
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.contrasena.message}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link 
                  to="/recuperar-contrasena" 
                  className="text-sm text-blue-400 hover:text-blue-300 transition hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-blue-600 disabled:hover:to-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Ingresar al sistema</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-900/60 px-4 text-xs text-slate-500">o</span>
              </div>
            </div>

            {/* Create Account Link */}
            <div className="text-center">
              <p className="text-sm text-slate-400">
                ¿No tienes cuenta institucional?{' '}
                <Link
                  to="/solicitar-cuenta"
                  className="font-semibold text-amber-400 hover:text-amber-300 transition hover:underline"
                >
                  Solicitar cuenta
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Conexión segura SSL encriptada</span>
          </div>
        </div>
      </div>
    </div>
  )
}
