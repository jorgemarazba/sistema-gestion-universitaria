import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3003/api/v1';

export type TipoNotificacion = 'info' | 'warning' | 'success' | 'urgent' | 'pago' | 'ticket' | 'solicitud' | 'sistema';

export interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoNotificacion;
  estado: 'pendiente' | 'leida' | 'archivada';
  usuarioId?: string;
  entidadId?: string;
  entidadTipo?: string;
  paraAdmin: boolean;
  metadata?: Record<string, any>;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearNotificacionData {
  titulo: string;
  descripcion: string;
  tipo: TipoNotificacion;
  destinatarios?: string;
  enviarEmail?: boolean;
  usuarioId?: string;
  entidadId?: string;
  entidadTipo?: string;
  paraAdmin?: boolean;
  metadata?: Record<string, any>;
}

export const NotificacionesService = {
  // Obtener notificaciones
  async obtenerNotificaciones(params?: { usuarioId?: string; admin?: boolean }): Promise<Notificacion[]> {
    const response = await axios.get(`${API_URL}/notificaciones`, { params });
    const data = response.data;
    // Handle both wrapped {data: [...]} and direct array responses
    return Array.isArray(data) ? data : (data.data || []);
  },

  // Contar notificaciones pendientes
  async contarPendientes(usuarioId?: string): Promise<number> {
    const response = await axios.get(`${API_URL}/notificaciones/contar-pendientes`, {
      params: usuarioId ? { usuarioId } : undefined,
    });
    return response.data.cantidad;
  },

  // Crear notificación
  async crearNotificacion(data: CrearNotificacionData): Promise<Notificacion> {
    const response = await axios.post(`${API_URL}/notificaciones`, data);
    return response.data;
  },

  // Eliminar notificación
  async eliminarNotificacion(id: string): Promise<void> {
    await axios.delete(`${API_URL}/notificaciones/${id}`);
  },

  // Marcar como leída
  async marcarComoLeida(id: string): Promise<Notificacion> {
    const response = await axios.post(`${API_URL}/notificaciones/${id}/leer`);
    return response.data;
  },

  // Marcar todas como leídas
  async marcarTodasComoLeidas(usuarioId?: string): Promise<void> {
    await axios.post(`${API_URL}/notificaciones/marcar-todas-leidas`, { usuarioId });
  },
};
