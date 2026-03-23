import { BookOpen, GraduationCap, Layers, Trophy } from 'lucide-react'

const items = [
  {
    title: 'Cursos',
    desc: 'Formación continua y diplomaturas con certificación.',
    icon: BookOpen,
    color: 'bg-emerald-500',
  },
  {
    title: 'Carreras',
    desc: 'Pregrado con enfoque práctico e investigación aplicada.',
    icon: GraduationCap,
    color: 'bg-violet-500',
  },
  {
    title: 'Especializaciones',
    desc: 'Profundiza tu perfil profesional en 12 a 18 meses.',
    icon: Layers,
    color: 'bg-amber-500',
  },
  {
    title: 'Maestría',
    desc: 'Programas de alto nivel con tesis o trabajo de grado.',
    icon: Trophy,
    color: 'bg-rose-500',
  },
] as const

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ title, desc, icon: Icon, color }) => (
          <div
            key={title}
            className="flex flex-row items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-white ${color}`}
            >
              <Icon className="size-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
