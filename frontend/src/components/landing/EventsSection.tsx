import { EVENT_ITEMS } from '../../data/content'

export function EventsSection() {
  return (
    <section className="border-t border-slate-800 bg-[#0a0e17] py-16 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-white">
          Eventos
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {EVENT_ITEMS.map((e) => (
            <article
              key={e.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/60 shadow-lg"
            >
              <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden">
                <img
                  src={e.image}
                  alt={e.title}
                  className="size-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold text-white">{e.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {e.excerpt}
                </p>
                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                  Leer más
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="rounded-xl border-2 border-violet-500 bg-transparent px-8 py-3 font-semibold text-violet-300 transition hover:bg-violet-950/50"
          >
            Más eventos
          </button>
        </div>
      </div>
    </section>
  )
}
