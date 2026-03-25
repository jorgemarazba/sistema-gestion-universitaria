import api from '../api/axios';

export interface AdminStats {
  totalUsers: number;
  pendingRequests: number;
  activeUsers: number;
  activeCourses: number;
  alerts: number;
}

export interface RoleDistribution {
  role: string;
  count: number;
}

export interface PendingSolicitud {
  id_usuario: string;
  nombre: string;
  apellido: string;
  correoPersonal: string;
  rol: string;
  estado: string;
  fechaRegistro: string;
}

/**
 * Obtener métricas globales del dashboard
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await api.get('/usuarios/dashboard/stats');
    console.log('📊 Stats API Response:', response.data);
    // El interceptor envuelve la respuesta en { success: true, data: {...} }
    const data = response.data?.data || response.data;
    console.log('📊 Extracted Stats:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    throw error;
  }
};

/**
 * Obtener distribución de usuarios por rol
 */
export const getRoleDistribution = async (): Promise<RoleDistribution[]> => {
  try {
    const response = await api.get('/usuarios/dashboard/roles');
    console.log('👥 Roles API Response:', response.data);
    // El interceptor envuelve la respuesta en { success: true, data: {...} }
    const data = response.data?.data || response.data;
    console.log('👥 Extracted Roles:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching role distribution:', error);
    throw error;
  }
};

/**
 * Obtener lista de usuarios pendientes de aprobación
 */
export const getPendingSolicitudes = async (): Promise<PendingSolicitud[]> => {
  try {
    const response = await api.get('/usuarios/pendientes');
    console.log('⏳ Pending API Response:', response.data);
    // El interceptor envuelve la respuesta en { success: true, data: {...} }
    const data = response.data?.data || response.data;
    console.log('⏳ Extracted Pending:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching pending solicitudes:', error);
    throw error;
  }
};

/**
 * Actualizar estado de un usuario (aprobar/rechazar)
 */
export const updateUserStatus = async (
  userId: string,
  status: 'activo' | 'rechazado'
): Promise<any> => {
  try {
    const response = await api.patch(`/usuarios/${userId}/status`, { status });
    console.log('✏️ Update Status API Response:', response.data);
    // El interceptor envuelve la respuesta en { success: true, data: {...} }
    const data = response.data?.data || response.data;
    console.log('✏️ Extracted Update Result:', data);
    return data;
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    throw error;
  }
};
