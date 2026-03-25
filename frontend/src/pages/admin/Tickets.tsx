export const AdminTickets = () => {
  const tickets = [
    { id: 1, usuario: 'Juan Pérez', asunto: 'Problema de acceso al portal', estado: 'Abierto', prioridad: 'Alta', fecha: '2024-03-20' },
    { id: 2, usuario: 'María López', asunto: 'Cambio de contraseña', estado: 'En Proceso', prioridad: 'Media', fecha: '2024-03-19' },
    { id: 3, usuario: 'Carlos García', asunto: 'Descarga de certificado', estado: 'Cerrado', prioridad: 'Baja', fecha: '2024-03-18' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#000000' }}>Tickets de Soporte</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Usuario</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Asunto</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Estado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Prioridad</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#000000' }}>Fecha</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase" style={{ color: '#000000' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium" style={{ color: '#000000' }}>{ticket.usuario}</td>
                <td className="px-5 py-4 text-sm" style={{ color: '#000000' }}>{ticket.asunto}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.estado === 'Abierto' ? 'bg-blue-100 text-blue-700' : ticket.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {ticket.estado}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.prioridad === 'Alta' ? 'bg-red-100 text-red-700' : ticket.prioridad === 'Media' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {ticket.prioridad}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{ticket.fecha}</td>
                <td className="px-5 py-4 text-sm flex justify-center gap-2">
                  <button className="text-blue-600 hover:underline">Responder</button>
                  <button className="text-red-600 hover:underline">Cerrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
