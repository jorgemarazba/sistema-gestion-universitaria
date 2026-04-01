import { create } from 'zustand';
import { NotificacionesService, type Notificacion } from '../services/notificaciones.service';

interface NotificacionesStore {
  notificaciones: Notificacion[];
  contadorPendientes: number;
  cargando: boolean;
  cargarNotificaciones: () => Promise<void>;
  marcarComoLeida: (id: string) => Promise<void>;
  marcarTodasComoLeidas: () => Promise<void>;
}

export const useNotificacionesStore = create<NotificacionesStore>((set, get) => ({
  notificaciones: [],
  contadorPendientes: 0,
  cargando: false,

  cargarNotificaciones: async () => {
    try {
      set({ cargando: true });
      const notificaciones = await NotificacionesService.obtenerNotificaciones({ admin: true });
      const pendientes = notificaciones.filter((n) => n.estado === 'pendiente').length;
      set({ notificaciones, contadorPendientes: pendientes });
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      set({ cargando: false });
    }
  },

  marcarComoLeida: async (id: string) => {
    try {
      await NotificacionesService.marcarComoLeida(id);
      await get().cargarNotificaciones();
    } catch (err) {
      console.error('Error al marcar notificación:', err);
    }
  },

  marcarTodasComoLeidas: async () => {
    try {
      await NotificacionesService.marcarTodasComoLeidas();
      await get().cargarNotificaciones();
    } catch (err) {
      console.error('Error al marcar todas:', err);
    }
  },
}));
