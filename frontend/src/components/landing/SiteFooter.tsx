import { Link } from 'react-router-dom'
import { BrandMark } from '../common/BrandMark'

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <BrandMark size="sm" className="rounded-lg" />
              <span className="font-semibold text-white">
                Sistema Gestión Universitaria
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Plataforma para la vida académica: admisiones, aula virtual,
              gestión financiera y analítica institucional.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Enlaces</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/aspirante" className="hover:text-white">
                  Aspirantes
                </Link>
              </li>
              <li>
                <Link to="/estudiante" className="hover:text-white">
                  Estudiantes
                </Link>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-white">
                  Precios
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/privacidad" className="hover:text-white">
                  Términos y política de datos
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-white">
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-white">
                  Tratamiento de datos personales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Contacto</h4>
            <p className="mt-4 text-sm">
              soporte@sistema-gestion-universitaria.edu
              <br />
              +57 (1) 234 5678
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Sistema Gestión Universitaria. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  )
}
