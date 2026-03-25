export const AdminReportes = () => {
  const reportes = [
    { id: 1, titulo: 'Reporte de Usuarios Activos', tipo: 'Usuarios', generado: '2024-03-20', acciones: 'Descargar' },
    { id: 2, titulo: 'Reporte de Ingresos', tipo: 'Pagos', generado: '2024-03-19', acciones: 'Descargar' },
    { id: 3, titulo: 'Reporte de Matriculaciones', tipo: 'Matrículas', generado: '2024-03-18', acciones: 'Descargar' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#000000' }}>Reportes</h1>
      
      <div className="mb-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">Generar Nuevo Reporte</button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Título</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Tipo</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Fecha de Generación</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase" style={{ color: '#000000' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte) => (
              <tr key={reporte.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium" style={{ color: '#000000' }}>{reporte.titulo}</td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{reporte.tipo}</td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{reporte.generado}</td>
                <td className="px-5 py-4 text-sm flex justify-center gap-2">
                  <button className="text-blue-600 hover:underline">Descargar</button>
                  <button className="text-gray-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
