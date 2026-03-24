import { FlipCardImage } from '../components/common/FlipCardImage'
import { AspiranteVirtualForm } from '../components/audience/AspiranteVirtualForm'
import { ASPIRANTE_FLIP_CARDS } from '../data/audiencePages'

const HERO_IMG =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80'

export function AspirantePage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 dark:border-slate-800">
        <img
          src={HERO_IMG}
          alt="Estudiantes y aspirantes en campus universitario"
          className="aspect-21/9 w-full max-h-[420px object-cover"
        />
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Aspirantes
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-left text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Dar el paso hacia la educación superior es una decisión que transforma
          vidas. En Sistema Gestión Universitaria te acompañamos desde el primer
          contacto: conoce nuestra oferta académica, requisitos de admisión,
          opciones de financiación y el ecosistema digital que hará más simple tu
          ingreso, tu matrícula y tu día a día como estudiante. Aquí encontrarás
          información clara sobre carreras, especializaciones y maestrías,
          calendarios, convenios y las herramientas tecnológicas con las que
          aprenderás. Nuestro equipo de asesores está listo para orientarte de
          forma virtual o presencial y resolver tus dudas con trazabilidad y
          confidencialidad.
        </p>
      </div>

      <section className="border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ASPIRANTE_FLIP_CARDS.map((c) => (
              <FlipCardImage
                key={c.title}
                title={c.title}
                backText={c.back}
                imageUrl={c.image}
                imageAlt={c.title}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          Quiero ser contactado por un asesor de manera virtual
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-400">
          Completa el formulario y te llamaremos en el horario que prefieras.
        </p>
        <div className="mt-10">
          <AspiranteVirtualForm />
        </div>
      </section>
    </div>
  )
}
