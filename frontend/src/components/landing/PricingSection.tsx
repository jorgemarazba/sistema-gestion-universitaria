export function PricingSection() {
  const plans = [
    {
      name: 'Campus Básico',
      price: '$49',
      period: '/mes',
      desc: 'Hasta 500 estudiantes activos',
      features: ['Matrícula y notas', 'Portal estudiante', 'Soporte email'],
    },
    {
      name: 'Campus Pro',
      price: '$129',
      period: '/mes',
      desc: 'Hasta 5.000 estudiantes',
      features: [
        'Todo lo del plan Básico',
        'Pagos y facturación',
        'API y reportes',
        'Soporte prioritario',
      ],
      highlight: true,
    },
    {
      name: 'Institucional',
      price: 'A medida',
      period: '',
      desc: 'Red de sedes y gobierno de datos',
      features: [
        'SLA dedicado',
        'Integraciones LMS/ERP',
        'Capacitación onsite',
      ],
    },
  ]

  return (
    <section
      id="pricing"
      className="scroll-mt-28 border-t border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Precios del sistema
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Planes orientativos para instituciones que adoptan Sistema Gestión
          Universitaria. Ajustamos licencias según número de sedes y módulos.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                p.highlight
                  ? 'border-violet-500 bg-violet-50 shadow-lg ring-2 ring-violet-500/20 dark:border-violet-500 dark:bg-violet-950/40'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {p.desc}
              </p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {p.price}
                </span>
                <span className="text-slate-500">{p.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-violet-600 dark:text-violet-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-8 w-full rounded-xl py-3 font-semibold ${
                  p.highlight
                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                    : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                }`}
              >
                Solicitar cotización
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
