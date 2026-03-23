import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { COUNTRIES } from '../../data/countries'
import {
  AREAS_ESTUDIO,
  METODOLOGIAS,
  PROGRAMAS_ASPIRANTE,
  TIPOS_DOCUMENTO,
} from '../../data/audiencePages'

const schema = z.object({
  nombres: z.string().min(2, 'Requerido'),
  apellidos: z.string().min(2, 'Requerido'),
  paisCodigo: z.string(),
  telefono: z.string().min(6, 'Teléfono inválido'),
  tipoDocumento: z.string().min(1, 'Selecciona un documento'),
  numeroDocumento: z.string().min(4, 'Número de documento requerido'),
  email: z.string().email('Email inválido'),
  dondeVives: z.string().min(3, 'Indica ciudad o dirección'),
  metodologia: z.string().min(1, 'Selecciona metodología'),
  areaEstudio: z.string().min(1, 'Selecciona área'),
  programa: z.string().min(1, 'Selecciona programa'),
  aceptaTerminos: z
    .boolean()
    .refine((v) => v === true, { message: 'Debes aceptar las condiciones' }),
})

type FormValues = z.infer<typeof schema>

export function AspiranteVirtualForm() {
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
      aceptaTerminos: false,
    },
  })

  const paisCodigo = useWatch({ control, name: 'paisCodigo', defaultValue: defaultCountry.code }) ?? defaultCountry.code
  const selected = useMemo(
    () => COUNTRIES.find((c) => c.code === paisCodigo) ?? defaultCountry,
    [paisCodigo, defaultCountry],
  )

  const onSubmit = (data: FormValues) => {
    console.log('Agendar llamada:', data, selected.dial)
    alert(
      `Solicitud registrada (demo). Te contactaremos al ${selected.dial} ${data.telefono}`,
    )
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombres
          </label>
          <input
            {...register('nombres')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          />
          {errors.nombres && (
            <p className="mt-1 text-xs text-red-600">{errors.nombres.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Apellidos
          </label>
          <input
            {...register('apellidos')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          />
          {errors.apellidos && (
            <p className="mt-1 text-xs text-red-600">{errors.apellidos.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Teléfono
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 sm:max-w-[min(100%,320px)] sm:flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-lg">
              {selected.flag}
            </span>
            <select
              {...register('paisCodigo')}
              className="w-full appearance-none rounded-xl border border-slate-200 py-2 pl-11 pr-3 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.dial})
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-0 flex-1 gap-2">
            <span className="flex shrink-0 items-center rounded-xl border border-slate-200 px-3 text-sm font-medium dark:border-slate-600 dark:bg-slate-950">
              {selected.dial}
            </span>
            <input
              {...register('telefono')}
              type="tel"
              placeholder="Número"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
        {errors.telefono && (
          <p className="mt-1 text-xs text-red-600">{errors.telefono.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Documento de identificación
          </label>
          <select
            {...register('tipoDocumento')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          >
            <option value="">Tipo</option>
            {TIPOS_DOCUMENTO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.tipoDocumento && (
            <p className="mt-1 text-xs text-red-600">
              {errors.tipoDocumento.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Número de documento
          </label>
          <input
            {...register('numeroDocumento')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          />
          {errors.numeroDocumento && (
            <p className="mt-1 text-xs text-red-600">
              {errors.numeroDocumento.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          ¿Dónde vives?
        </label>
        <input
          {...register('dondeVives')}
          placeholder="Ciudad, barrio o dirección general"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
        />
        {errors.dondeVives && (
          <p className="mt-1 text-xs text-red-600">{errors.dondeVives.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Metodología
          </label>
          <select
            {...register('metodologia')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          >
            <option value="">Seleccione una metodología</option>
            {METODOLOGIAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.metodologia && (
            <p className="mt-1 text-xs text-red-600">{errors.metodologia.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Área de estudio
          </label>
          <select
            {...register('areaEstudio')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          >
            <option value="">Selecciona un área</option>
            {AREAS_ESTUDIO.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {errors.areaEstudio && (
            <p className="mt-1 text-xs text-red-600">{errors.areaEstudio.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Programa
        </label>
        <select
          {...register('programa')}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
        >
          <option value="">Selecciona un programa</option>
          {PROGRAMAS_ASPIRANTE.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.programa && (
          <p className="mt-1 text-xs text-red-600">{errors.programa.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Agendar llamada
        </button>
        <label className="flex max-w-md cursor-pointer items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            {...register('aceptaTerminos')}
            className="mt-1 size-4 rounded border-slate-300 text-violet-600"
          />
          <span>
            Acepto las{' '}
            <Link
              to="/privacidad"
              className="font-medium text-violet-600 underline hover:text-violet-500 dark:text-violet-400"
            >
              condiciones de uso
            </Link>{' '}
            y el tratamiento de mis datos según la política de la institución.
          </span>
        </label>
      </div>
      {errors.aceptaTerminos && (
        <p className="text-xs text-red-600">{errors.aceptaTerminos.message}</p>
      )}
    </form>
  )
}
