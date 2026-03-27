export const AdminReportes = () => {
  const reportes = [
    { id: 1, titulo: 'Reporte de Usuarios Activos', tipo: 'Usuarios', generado: '2024-03-20', acciones: 'Descargar' },
    { id: 2, titulo: 'Reporte de Ingresos', tipo: 'Pagos', generado: '2024-03-19', acciones: 'Descargar' },
    { id: 3, titulo: 'Reporte de Matriculaciones', tipo: 'Matrículas', generado: '2024-03-18', acciones: 'Descargar' },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Reportes</h1>
      
      <div className="mb-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">Generar Nuevo Reporte</button>
      </div>

      <div className="bg-[#374151] rounded-xl shadow-lg border border-gray-600 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-800 border-b border-gray-600">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-300">Título</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-300">Tipo</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-300">Fecha de Generación</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte) => (
              <tr key={reporte.id} className="border-b border-gray-600 hover:bg-slate-800 transition">
                <td className="px-5 py-4 text-sm font-medium text-white">{reporte.titulo}</td>
                <td className="px-5 py-4 text-sm text-gray-300">{reporte.tipo}</td>
                <td className="px-5 py-4 text-sm text-gray-300">{reporte.generado}</td>
                <td className="px-5 py-4 text-sm flex justify-center gap-2">
                  <button className="text-blue-400 hover:text-blue-300">Descargar</button>
                  <button className="text-gray-400 hover:text-gray-300">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
