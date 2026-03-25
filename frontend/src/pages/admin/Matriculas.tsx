export const AdminMatriculas = () => {
  const matriculas = [
    { id: 1, estudiante: 'Juan Pérez', programa: 'Ingeniería en Sistemas', estado: 'Pagada', fecha: '2024-01-15' },
    { id: 2, estudiante: 'María López', programa: 'Administración', estado: 'Pendiente', fecha: '2024-01-18' },
    { id: 3, estudiante: 'Carlos García', programa: 'Derecho', estado: 'Pagada', fecha: '2024-01-20' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#000000' }}>Matrículas</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Estudiante</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Programa</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Estado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Fecha</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase" style={{ color: '#000000' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.map((matricula) => (
              <tr key={matricula.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium" style={{ color: '#000000' }}>{matricula.estudiante}</td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{matricula.programa}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${matricula.estado === 'Pagada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`} style={{ color: '#000000' }}>
                    {matricula.estado}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{matricula.fecha}</td>
                <td className="px-5 py-4 text-sm flex justify-center gap-2">
                  <button className="text-blue-600 hover:underline">Ver</button>
                  <button className="text-red-600 hover:underline">Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
