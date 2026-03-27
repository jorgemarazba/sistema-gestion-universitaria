import { User, Check, X, CreditCard, Ticket, UserPlus, Bell } from 'lucide-react';

export const AdminNotificaciones = () => {
  const notificaciones = [
    { 
      id: 1, 
      tipo: 'solicitud',
      titulo: 'Nueva solicitud de usuario', 
      descripcion: 'Juan Pérez ha solicitado acceso al sistema', 
      fecha: '2 h',
      leida: false,
      avatar: 'JP',
      acciones: ['Confirmar', 'Rechazar']
    },
    { 
      id: 2, 
      tipo: 'pago',
      titulo: 'Pago procesado', 
      descripcion: 'El pago de María López ha sido confirmado', 
      fecha: '5 h',
      leida: true,
      avatar: 'ML'
    },
    { 
      id: 3, 
      tipo: 'ticket',
      titulo: 'Ticket resuelto', 
      descripcion: 'El ticket de Carlos García ha sido resuelto', 
      fecha: '1 d',
      leida: true,
      avatar: 'CG'
    },
    { 
      id: 4, 
      tipo: 'solicitud',
      titulo: 'Nueva matrícula', 
      descripcion: 'Ana Torres solicitó matrícula en Ingeniería', 
      fecha: '30 min',
      leida: false,
      avatar: 'AT',
      acciones: ['Aprobar', 'Rechazar']
    },
  ];

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'solicitud': return <UserPlus size={14} className="text-blue-400" />;
      case 'pago': return <CreditCard size={14} className="text-green-400" />;
      case 'ticket': return <Ticket size={14} className="text-purple-400" />;
      default: return <Bell size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header estilo Facebook */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
          <button className="text-blue-400 text-sm hover:text-blue-300 transition">
            Marcar todas como leídas
          </button>
        </div>

        {/* Lista de notificaciones estilo Facebook */}
        <div className="space-y-1">
          {notificaciones.map((notif) => (
            <div 
              key={notif.id} 
              className={`flex items-start gap-3 p-3 rounded-xl transition cursor-pointer ${
                notif.leida 
                  ? 'hover:bg-[#1e293b]' 
                  : 'bg-[#1e3a5f]/30 hover:bg-[#1e3a5f]/50'
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {notif.avatar}
                </div>
                {/* Icono de tipo en esquina */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1e293b] border-2 border-[#0f172a] flex items-center justify-center">
                  {getIconoTipo(notif.tipo)}
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-[15px] leading-snug">
                  <span className="font-semibold">{notif.titulo}</span>{' '}
                  <span className="text-gray-300">{notif.descripcion}</span>
                </p>
                <p className="text-blue-400 text-xs mt-1">{notif.fecha}</p>

                {/* Botones de acción para solicitudes */}
                {notif.acciones && !notif.leida && (
                  <div className="flex gap-2 mt-3">
                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition">
                      <Check size={14} />
                      {notif.acciones[0]}
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#374151] hover:bg-[#4b5563] text-white text-sm font-medium rounded-lg transition">
                      <X size={14} />
                      {notif.acciones[1]}
                    </button>
                  </div>
                )}
              </div>

              {/* Indicador de no leído */}
              {!notif.leida && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Ver más */}
        <div className="text-center mt-6">
          <button className="px-6 py-2 bg-[#1e293b] hover:bg-[#374151] text-white text-sm font-medium rounded-full transition">
            Ver notificaciones anteriores
          </button>
        </div>
      </div>
    </div>
  );
};
