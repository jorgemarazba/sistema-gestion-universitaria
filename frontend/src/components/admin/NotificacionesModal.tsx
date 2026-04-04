import React from 'react';
import { X, Bell, GraduationCap, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: string;
  creadoEn: string;
  entidadTipo?: string;
  entidadId?: string;
}

interface NotificacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificaciones: Notificacion[];
  onNotificacionClick: (notif: Notificacion) => void;
  onMarcarTodasLeidas: () => void;
  contadorPendientes: number;
}

const tipoConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  solicitud: {
    icon: <GraduationCap size={20} />,
    color: 'bg-blue-500',
    label: 'Solicitud'
  },
  ticket: {
    icon: <AlertCircle size={20} />,
    color: 'bg-purple-500',
    label: 'Ticket'
  },
  pago: {
    icon: <CheckCircle size={20} />,
    color: 'bg-green-500',
    label: 'Pago'
  },
  sistema: {
    icon: <Info size={20} />,
    color: 'bg-orange-500',
    label: 'Sistema'
  }
};

const getNotificacionConfig = (notif: Notificacion) => {
  // Si es asesoramiento, mostrar como solicitud
  if (notif.entidadTipo === 'asesoramiento') {
    return tipoConfig.solicitud;
  }
  return tipoConfig[notif.tipo] || tipoConfig.sistema;
};

const tiempoRelativo = (fecha: string) => {
  const diff = Date.now() - new Date(fecha).getTime();
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (minutos < 1) return 'Ahora';
  if (minutos < 60) return `${minutos} min`;
  if (horas < 24) return `${horas} h`;
  if (dias < 7) return `${dias} d`;
  return new Date(fecha).toLocaleDateString();
};

export function NotificacionesModal({
  isOpen,
  onClose,
  notificaciones,
  onNotificacionClick,
  onMarcarTodasLeidas,
  contadorPendientes
}: NotificacionesModalProps) {
  // Debug
  console.log('NotificacionesModal - notificaciones:', notificaciones?.length, notificaciones);
  console.log('NotificacionesModal - contadorPendientes:', contadorPendientes);
  
  if (!isOpen) return null;

  // Separar notificaciones pendientes y leídas
  const pendientes = notificaciones.filter(n => n.estado === 'pendiente');
  const leidas = notificaciones.filter(n => n.estado !== 'pendiente');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden flex flex-col">
        {/* Header - Estilo Universitario */}
        <div className="relative bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 px-6 py-5 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Centro de Notificaciones
                  {contadorPendientes > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      {contadorPendientes}
                    </span>
                  )}
                </h2>
                <p className="text-blue-200 text-sm">Universidad - Panel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {pendientes.length > 0 && (
                <button
                  onClick={onMarcarTodasLeidas}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition flex items-center gap-1.5 border border-white/20"
                >
                  <CheckCircle size={14} />
                  Marcar todas
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 text-white rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Sección Pendientes - Siempre visible */}
          <div>
            <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Pendientes ({pendientes.length})
            </h3>
            {pendientes.length > 0 ? (
              <div className="space-y-2">
                {pendientes.map((notif) => {
                  const config = getNotificacionConfig(notif);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => onNotificacionClick(notif)}
                      className="group relative bg-linear-to-r from-blue-900/50 to-slate-800/50 hover:from-blue-800/50 hover:to-slate-700/50 border border-blue-500/30 hover:border-blue-400/50 rounded-xl p-4 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-white font-semibold text-sm leading-tight">
                                {notif.titulo}
                              </p>
                              <p className="text-slate-300 text-sm mt-1 line-clamp-2">
                                {notif.descripcion}
                              </p>
                            </div>
                            <span className="text-blue-400 text-xs whitespace-nowrap">
                              {tiempoRelativo(notif.creadoEn)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color} text-white`}>
                              {config.label}
                            </span>
                            <span className="text-xs text-slate-400">
                              {notif.entidadTipo === 'asesoramiento' && '• Asesoría académica'}
                              {notif.entidadTipo === 'estudiante' && '• Nuevo estudiante'}
                              {notif.entidadTipo === 'profesor' && '• Nuevo profesor'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Unread indicator */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-3">No hay notificaciones pendientes</p>
            )}
          </div>

          {/* Sección Leídas - Siempre visible */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Historial ({leidas.length})
            </h3>
            {leidas.length > 0 ? (
              <div className="space-y-2">
                {leidas.map((notif) => {
                  const config = getNotificacionConfig(notif);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => onNotificacionClick(notif)}
                      className="group bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-4 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 ${config.color} opacity-70 rounded-xl flex items-center justify-center text-white`}>
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-slate-300 font-medium text-sm leading-tight">
                                {notif.titulo}
                              </p>
                              <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                                {notif.descripcion}
                              </p>
                            </div>
                            <span className="text-slate-500 text-xs whitespace-nowrap">
                              {tiempoRelativo(notif.creadoEn)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-700 text-slate-300">
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-3">No hay notificaciones en el historial</p>
            )}
          </div>

          {/* Empty state */}
          {notificaciones.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">No hay notificaciones</p>
              <p className="text-slate-500 text-sm mt-1">Las nuevas solicitudes aparecerán aquí</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900/80 border-t border-slate-700/50 px-6 py-3">
          <p className="text-slate-500 text-xs text-center">
            Universidad - Sistema de Gestión Académica
          </p>
        </div>
      </div>
    </div>
  );
}
