export function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Política de protección de datos personales
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Documentación de referencia para aspirantes, estudiantes y visitantes
          del sitio.
        </p>

        <div className="mt-10 space-y-8">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Aviso de privacidad
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Sistema Gestión Universitaria, en calidad de responsable del
                tratamiento, informa que los datos personales que recolecta a
                través de formularios y canales digitales serán utilizados para
                fines de contacto, admisión, prestación del servicio educativo y
                mejora de la experiencia del usuario.
              </p>
              <p>
                El tratamiento se realiza conforme a la legislación aplicable en
                protección de datos. Usted puede ejercer sus derechos de
                conocimiento, actualización, rectificación y supresión según los
                canales institucionales habilitados.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Tratamiento de datos personales
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Los datos identificativos, de contacto y académicos se conservan
                durante el tiempo necesario para cumplir la relación contractual y
                las obligaciones legales. No se cederán a terceros salvo mandato
                legal o proveedores que actúen como encargados bajo contrato y
                medidas de seguridad adecuadas.
              </p>
              <p>
                Medidas técnicas y organizativas (cifrado en tránsito, control de
                accesos, bitácoras) se aplican para proteger la confidencialidad e
                integridad de la información.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Política de protección de datos
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Esta política describe los principios de licitud, finalidad,
                proporcionalidad y transparencia que rigen el tratamiento en el
                ecosistema digital de la institución, incluido el presente portal
                y el Sistema Gestión Universitaria.
              </p>
              <p>
                Para consultas sobre protección de datos puede escribir a{' '}
                <span className="font-medium text-violet-600 dark:text-violet-400">
                  privacidad@sistema-gestion-universitaria.edu
                </span>
                .
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
