export const AdminProgramas = () => {
  const programas = [
    { id: 1, nombre: 'Ingeniería en Sistemas', estado: 'Activo', estudiantes: 120 },
    { id: 2, nombre: 'Administración de Empresas', estado: 'Activo', estudiantes: 95 },
    { id: 3, nombre: 'Derecho', estado: 'Inactivo', estudiantes: 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#000000' }}>Programas Académicos</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Programa</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Estado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Estudiantes</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase" style={{ color: '#000000' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {programas.map((programa) => (
              <tr key={programa.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium" style={{ color: '#000000' }}>{programa.nombre}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${programa.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} style={{ color: '#000000' }}>
                    {programa.estado}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{programa.estudiantes}</td>
                <td className="px-5 py-4 text-sm flex justify-center gap-2">
                  <button className="text-blue-600 hover:underline">Editar</button>
                  <button className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
