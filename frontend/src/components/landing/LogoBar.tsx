import { useState } from 'react'
import { BookOpen, Building2, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../common/BrandMark'

const btnOutline =
  'inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:border-violet-500 hover:text-white'

export function LogoBar() {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <section className="border-b border-slate-800 bg-[#0f1419]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left"
        >
          <div className="flex items-center gap-3">
            <BrandMark size="lg" />
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">
                Sistema Gestión Universitaria
              </p>
              <p className="text-sm text-slate-400">
                Plataforma integral para tu vida académica
              </p>
            </div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-2">
          <a href="/#sedes" className={btnOutline}>
            <Building2 className="size-4" />
            Sedes
          </a>
          <a href="/#nosotros" className={btnOutline}>
            <BookOpen className="size-4" />
            Acerca de nosotros
          </a>
          <div className="relative">
            <button
              type="button"
              onClick={() => setInfoOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/50 bg-violet-950/40 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-900/50"
            >
              <Info className="size-4" />
              Información
            </button>
            {infoOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-[min(100vw-2rem,28rem)] rounded-2xl border border-slate-700 bg-slate-900 p-4 text-left shadow-xl">
                <h3 className="mb-2 font-semibold text-white">¿Cómo se creó?</h3>
                <p className="mb-3 text-sm leading-relaxed text-slate-300">
                  Nació como proyecto académico–tecnológico para digitalizar procesos
                  que antes dependían de papeles y hojas de cálculo dispersas.
                </p>
                <h3 className="mb-2 font-semibold text-white">
                  ¿Qué problema resuelve?
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Centraliza matrícula, notas, pagos y comunicación en un solo lugar,
                  reduciendo errores, tiempos de respuesta y costos operativos para la
                  institución y mejorando la experiencia de aspirantes, estudiantes,
                  docentes y egresados.
                </p>
                <button
                  type="button"
                  className="mt-3 text-sm font-medium text-violet-400 hover:underline"
                  onClick={() => setInfoOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </section>
  )
}
