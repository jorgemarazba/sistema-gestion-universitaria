const HERO_IMG =
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80'

export function EgresadoPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 dark:border-slate-800">
        <img
          src={HERO_IMG}
          alt="Graduación y egresados"
          className="aspect-21/9 w-full max-h-[420px] object-cover"
        />
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          Dirección de egresados y prácticas
        </h1>
        <h2 className="mt-8 text-xl font-semibold text-violet-700 dark:text-violet-300">
          Egresados y estudiantes de nuestra comunidad universitaria
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          La relación con nuestra comunidad no termina en la ceremonia de grado.
          La Dirección de egresados y prácticas articula oportunidades laborales,
          redes de contacto, actualización profesional y acompañamiento en la
          transición al mundo laboral. Si aún cursas prácticas o pasantías,
          encontrarás lineamientos, convenios y seguimiento tutorial alineado con
          el Sistema Gestión Universitaria para que tu experiencia sea formativa y
          verificable. Los egresados acceden a beneficios, eventos y canales de
          comunicación para seguir vinculados a la universidad.
        </p>
        <p className="animate-pulse-slow mt-10 text-center text-lg font-medium italic text-violet-600 dark:text-violet-400">
          «Tu logro es el nuestro: sigue creciendo con nuestra red de egresados.»
        </p>
      </div>
    </div>
  )
}
