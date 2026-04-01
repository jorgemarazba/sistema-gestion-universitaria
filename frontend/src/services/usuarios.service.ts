import axios from 'axios';

const API_URL = 'http://localhost:3003/api/v1';

// Interfaz de Usuario
export interface Usuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  email?: string;
  rol: 'estudiante' | 'profesor' | 'administrador';
  estado?: 'activo' | 'inactivo' | 'pendiente';
}

// Crear instancia de axios para usuarios
const usuariosApi = axios.create({
  baseURL: `${API_URL}/usuarios`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
usuariosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const UsuariosService = {
  // Obtener todos los usuarios
  getAll: async (): Promise<Usuario[]> => {
    const response = await usuariosApi.get<{ success: boolean; data: Usuario[] }>('/');
    return response.data.data || [];
  },

  // Obtener un usuario por ID
  getById: async (id: string): Promise<Usuario> => {
    const response = await usuariosApi.get<{ success: boolean; data: Usuario }>(`/${id}`);
    return response.data.data;
  },

  // Obtener usuarios por rol (para profesores)
  getByRol: async (rol: string): Promise<Usuario[]> => {
    const response = await usuariosApi.get<{ success: boolean; data: Usuario[] }>(`?rol=${rol}`);
    return response.data.data || [];
  },
};
