import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api/v1';

export interface Programa {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  semestres: number;
  cursos: number;
  estudiantes: number;
  estado: 'activo' | 'inactivo' | 'en_planeacion';
  nivel: 'pregrado' | 'posgrado' | 'diplomado' | 'especializacion' | 'maestria' | 'doctorado';
  creditosTotales?: number;
  coordinadorId?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateProgramaData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  semestres: number;
  cursos?: number;
  estudiantes?: number;
  estado?: 'activo' | 'inactivo' | 'en_planeacion';
  nivel?: 'pregrado' | 'posgrado' | 'diplomado' | 'especializacion' | 'maestria' | 'doctorado';
  creditosTotales?: number;
  coordinadorId?: string;
}

export interface UpdateProgramaData extends Partial<CreateProgramaData> {}

const programasApi = axios.create({
  baseURL: `${API_URL}/programas`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
programasApi.interceptors.request.use(
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

// Interceptor para debuggear errores y respuestas
programasApi.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Error API Programas:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const ProgramasService = {
  // Obtener todos los programas
  getAll: async (estado?: string): Promise<Programa[]> => {
    const params = estado ? { estado } : {};
    const response = await programasApi.get('/', { params });
    // La API devuelve {success: true, data: [...]}
    return response.data.data || response.data || [];
  },

  // Obtener un programa por ID
  getById: async (id: string): Promise<Programa> => {
    const response = await programasApi.get(`/${id}`);
    return response.data;
  },

  // Crear un nuevo programa
  create: async (data: CreateProgramaData): Promise<Programa> => {
    const response = await programasApi.post('/', data);
    return response.data;
  },

  // Actualizar un programa
  update: async (id: string, data: UpdateProgramaData): Promise<Programa> => {
    const response = await programasApi.patch(`/${id}`, data);
    return response.data;
  },

  // Eliminar un programa
  delete: async (id: string): Promise<void> => {
    await programasApi.delete(`/${id}`);
  },
};
