import { SPECIALTIES } from '../../data/specialties'

export function FlipSpecialties() {
  return (
    <section className="bg-slate-100 py-16 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Nuestras áreas de estudio
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALTIES.map((s) => (
            <div
              key={s.id}
              className="group h-56 perspective-[1000px] sm:h-64"
            >
              <div className="relative h-full w-full transition-transform duration-500 transform-3d group-hover:rotate-y-180">
                {/* Frente: imagen + overlay + texto */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-200 shadow-lg backface-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-violet-950/95 via-violet-900/50 to-indigo-900/30" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-center text-white">
                    <p className="text-xs font-medium uppercase tracking-wider text-violet-200">
                      {s.short}
                    </p>
                    <h3 className="mt-2 text-lg font-bold leading-snug drop-shadow-md">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm text-violet-100">
                      Pasa el cursor para ver más
                    </p>
                  </div>
                </div>
                {/* Reverso */}
                <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-5 text-left backface-hidden rotate-y-180 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
