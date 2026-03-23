import { FlipCardText } from '../components/common/FlipCardText'

const HERO_IMG =
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=80'

const CARDS: { front: string; back: string }[] = [
  {
    front: 'Proyecto educativo institucional',
    back: 'Marco filosófico, modelo educativo y líneas de desarrollo institucional que orientan la labor docente.',
  },
  {
    front: 'Modelo regular',
    back: 'Estructura de períodos, evaluación y seguimiento académico del modelo regular de la institución.',
  },
  {
    front: 'Reglamento docente',
    back: 'Derechos, deberes, evaluación del desempeño y procedimientos para el cuerpo profesoral.',
  },
  {
    front: 'Reglamento de trabajo',
    back: 'Condiciones laborales, horarios, permisos y aspectos administrativos del vínculo con la universidad.',
  },
  {
    front: 'Calendario académico',
    back: 'Fechas clave: inicio y fin de clases, registro de notas, consejos de facultad y recessos.',
  },
  {
    front: 'Postúlate como profesor',
    back: 'Convocatorias, perfiles requeridos y canal para enviar hoja de vida y documentación.',
  },
  {
    front: 'Portal académico Class',
    back: 'Acceso a aula virtual, recursos, foros y herramientas de seguimiento del estudiante.',
  },
  {
    front: 'Elegidos a consejo institucionales',
    back: 'Participación en órganos colegiados, representación y agenda de construcción académica.',
  },
]

export function ProfesorPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 dark:border-slate-800">
        <img
          src={HERO_IMG}
          alt="Docencia universitaria"
          className="aspect-21/9 w-full max-h-[420px] object-cover"
        />
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Profesores
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          La calidad educativa se construye en el aula y en la tutoría. Esta
          sección reúne la normativa, los calendarios y los portales que necesitas
          para planificar tus cursos, registrar calificaciones y acompañar el
          aprendaje con estándares institucionales. También encontrarás vías para
          participar en la vida universitaria, postularte a nuevas vinculaciones y
          usar las herramientas digitales integradas al Sistema Gestión
          Universitaria.
        </p>
      </div>

      <section className="border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c) => (
              <FlipCardText
                key={c.front}
                frontTitle={c.front}
                backText={c.back}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
