/** Secciones enlazadas desde la barra bajo el logo */
export function SedesNosotros() {
  return (
    <>
      <section
        id="sedes"
        className="scroll-mt-28 border-t border-slate-200 bg-white py-14 dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sedes
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-400">
            Campus principal en la ciudad capital, sede regional costa y centro
            de extensiones con aulas híbridas. Consulta horarios de atención en
            cada sede desde el mapa interactivo (próximamente).
          </p>
        </div>
      </section>

      <section
        id="nosotros"
        className="scroll-mt-28 border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-700 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Acerca de nosotros
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-400">
            Somos un equipo académico y tecnológico comprometido con la calidad
            educativa. Sistema Gestión Universitaria nació para unificar
            procesos administrativos y pedagógicos en una sola experiencia
            digital segura y escalable.
          </p>
        </div>
      </section>
    </>
  )
}
