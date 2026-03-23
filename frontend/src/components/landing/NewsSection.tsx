import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NEWS_ITEMS } from '../../data/content'

const PAGE_SIZE = 4

export function NewsSection() {
  const [page, setPage] = useState(0)
  const maxPage = Math.max(0, Math.ceil(NEWS_ITEMS.length / PAGE_SIZE) - 1)
  const slice = NEWS_ITEMS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Noticias
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {slice.map((n) => (
            <article
              key={n.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <img
                src={n.image}
                alt=""
                className="aspect-4/3 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-4 text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {n.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
                  {n.excerpt}
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg border border-violet-200 bg-violet-50 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-200"
                >
                  Leer más
                </button>
                <div className="mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300"
                    aria-label="Atrás"
                  >
                    <ChevronLeft className="size-4" />
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                    disabled={page >= maxPage}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300"
                    aria-label="Siguiente"
                  >
                    Siguiente
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
