import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { COUNTRIES } from '../../data/countries'

const schema = z.object({
  nombres: z.string().min(2, 'Requerido'),
  apellidos: z.string().min(2, 'Requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(6, 'Teléfono inválido'),
  paisCodigo: z.string(),
  ciudad: z.string().min(2, 'Requerido'),
  modalidad: z.enum(['presencial', 'virtual', 'hibrida']),
  programa: z.string().min(1, 'Selecciona un programa'),
})

type FormValues = z.infer<typeof schema>

const programas = [
  'Ingeniería de Sistemas',
  'Medicina',
  'Derecho',
  'Administración',
  'Psicología',
  'Maestría en Gestión',
  'Especialización en Datos',
]

export function AdvisorForm() {
  const defaultCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === 'CO') ?? COUNTRIES[0],
    [],
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      paisCodigo: defaultCountry.code,
      modalidad: 'presencial',
      programa: '',
    },
  })

  const paisCodigo = useWatch({ control, name: 'paisCodigo', defaultValue: defaultCountry.code }) ?? defaultCountry.code
  const selected = useMemo(
    () => COUNTRIES.find((c) => c.code === paisCodigo) ?? defaultCountry,
    [paisCodigo, defaultCountry],
  )

  const onSubmit = (data: FormValues) => {
    console.log('Asesoría:', data, 'Indicativo:', selected.dial)
    alert(
      `Solicitud enviada (demo). ${data.nombres} ${data.apellidos} — ${selected.dial} ${data.telefono}`,
    )
    reset()
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Quiero ser asesorado por un profesor
      </h2>
      <p className="mb-10 text-center text-slate-600 dark:text-slate-400">
        Completa el formulario y un coordinador académico te contactará.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nombres" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nombres
            </label>
            <input
              id="nombres"
              autoComplete="given-name"
              {...register('nombres')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            {errors.nombres && (
              <p className="mt-1 text-xs text-red-600">{errors.nombres.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="apellidos" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Apellidos
            </label>
            <input
              id="apellidos"
              autoComplete="family-name"
              {...register('apellidos')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            {errors.apellidos && (
              <p className="mt-1 text-xs text-red-600">{errors.apellidos.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Teléfono
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="relative min-w-0 sm:max-w-[min(100%,320px)] sm:flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-lg">
                {selected.flag}
              </span>
              <select
                id="paisCodigo"
                {...register('paisCodigo')}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2 pl-11 pr-8 text-sm text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dial})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex min-w-0 flex-1 gap-2">
              <span className="flex shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {selected.dial}
              </span>
              <input
                id="telefono"
                {...register('telefono')}
                type="tel"
                autoComplete="tel"
                placeholder="Número móvil"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
          {errors.telefono && (
            <p className="mt-1 text-xs text-red-600">{errors.telefono.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ciudad" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Ciudad
            </label>
            <input
              id="ciudad"
              {...register('ciudad')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            {errors.ciudad && (
              <p className="mt-1 text-xs text-red-600">{errors.ciudad.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="modalidad" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Modalidad
            </label>
            <select
              id="modalidad"
              {...register('modalidad')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrida">Híbrida</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="programa" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Programa de interés
          </label>
          <select
            id="programa"
            {...register('programa')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-violet-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          >
            <option value="">Seleccione el programa</option>
            {programas.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.programa && (
            <p className="mt-1 text-xs text-red-600">{errors.programa.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Enviar
        </button>
      </form>
    </section>
  )
}
