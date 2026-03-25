export const AdminCursos = () => {
  const cursos = [
    { id: 1, titulo: 'Matemáticas Discretas', profesor: 'Carlos Ruiz', alumnos: 34, estado: 'Publicado' },
    { id: 2, titulo: 'Introducción a la Programación', profesor: 'Elena Torres', alumnos: 120, estado: 'Revisión' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#000000' }}>Supervisión de Cursos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="h-32 bg-indigo-500"></div> {/* Placeholder para imagen del curso */}
            <div className="p-4">
              <h2 className="text-lg font-bold" style={{ color: '#000000' }}>{curso.titulo}</h2>
              <p className="text-sm mt-1" style={{ color: '#000000' }}>Prof: {curso.profesor}</p>
              
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <span className="text-sm" style={{ color: '#000000' }}>{curso.alumnos} Alumnos</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${curso.estado === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {curso.estado}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 text-center border-t">
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">Auditar Contenido &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};