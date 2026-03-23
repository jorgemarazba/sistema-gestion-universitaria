import { FlipCardText } from '../components/common/FlipCardText'

const HERO_IMG =
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80'

const CARDS: { front: string; back: string; same?: boolean }[] = [
  {
    front: 'Reglamento estudiantil pregrado',
    back: 'Reglamento estudiantil pregrado',
    same: true,
  },
  {
    front: 'Reglamento estudiantil posgrado',
    back: 'Normativa académica y disciplinaria aplicable a programas de especialización y maestría.',
  },
  {
    front: 'Reglamento de opciones de grado',
    back: 'Trabajo de grado, monografía, práctica integrada y demás modalidades para optar al título.',
  },
  {
    front: 'Exámenes Saber Pro y TyT / 2026-1',
    back: 'Cronograma, inscripción y guías de preparación para las pruebas de estado del periodo 2026-1.',
  },
  {
    front: 'Postulación a grados',
    back: 'Requisitos, fechas y pasos en línea para solicitar tu acto de graduación.',
  },
  {
    front: 'Asesorías de prácticas',
    back: 'Acompañamiento para convenios, informes y evaluación de práctica profesional.',
  },
  {
    front: 'Solicitud de certificados',
    back: 'Certificados de estudio, notas y programas académicos con trámite digital.',
  },
  {
    front: 'Solicitudes financieras',
    back: 'Planes de pago, becas, cartera y aclaraciones sobre tu estado financiero.',
  },
]

export function EstudiantePage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 dark:border-slate-800">
        <img
          src={HERO_IMG}
          alt="Vida estudiantil universitaria"
          className="aspect-21/9 w-full max-h-[420px] object-cover"
        />
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Estudiante
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Tu formación es el centro de la institución. Desde el portal del
          estudiante puedes consultar notas, horarios, pagos y comunicaciones
          oficiales; además, acceder a los reglamentos e instructivos que rigen tu
          proceso académico. Te invitamos a conocer los recursos disponibles para
          pregrado y posgrado, prepararte para los exámenes de estado y gestionar
          trámites como certificados, prácticas y graduación de forma ordenada y
          segura.
        </p>
      </div>

      <section className="border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white">
            Reglamentos e instructivos
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c) => (
              <FlipCardText
                key={c.front}
                frontTitle={c.front}
                backText={c.back}
                backSameAsFront={c.same}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
