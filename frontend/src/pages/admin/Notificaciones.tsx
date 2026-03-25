export const AdminNotificaciones = () => {
  const notificaciones = [
    { id: 1, titulo: 'Nueva solicitud de usuario', descripcion: 'Juan Pérez ha solicitado acceso al sistema', fecha: '2024-03-20 14:30', leida: false },
    { id: 2, titulo: 'Pago procesado', descripcion: 'El pago de María López ha sido confirmado', fecha: '2024-03-19 10:15', leida: true },
    { id: 3, titulo: 'Ticket de soporte cerrado', descripcion: 'El ticket de Carlos García ha sido resuelto', fecha: '2024-03-18 16:45', leida: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#000000' }}>Notificaciones</h1>
      
      <div className="space-y-4">
        {notificaciones.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-lg border-l-4 ${notif.leida ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-500'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-semibold ${!notif.leida ? 'font-bold' : ''}`} style={{ color: '#000000' }}>{notif.titulo}</h3>
                <p className="text-sm mt-1" style={{ color: '#000000' }}>{notif.descripcion}</p>
                <p className="text-xs mt-2" style={{ color: '#000000' }}>{notif.fecha}</p>
              </div>
              <div className="flex gap-2">
                {!notif.leida && <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">Nueva</span>}
                <button className="text-gray-500 hover:text-red-600">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
