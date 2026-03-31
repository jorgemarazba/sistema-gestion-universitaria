import api from '../api/axios';
import type { Curso, CreateCursoData, UpdateCursoData } from '../types/curso.types';

const API_URL = '/cursos';

export const CursosService = {
  async getAll(carrera?: string, programaId?: string, modalidad?: string): Promise<Curso[]> {
    const params = new URLSearchParams();
    if (carrera) params.append('carrera', carrera);
    if (programaId) params.append('programaId', programaId);
    if (modalidad) params.append('modalidad', modalidad);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get<{success: boolean; data: Curso[]}>(`${API_URL}${query}`);
    // La API devuelve {success: true, data: [...]}
    return response.data.data || [];
  },

  async getById(id: string): Promise<Curso> {
    const response = await api.get<Curso>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(data: CreateCursoData): Promise<Curso> {
    const response = await api.post<Curso>(API_URL, data);
    return response.data;
  },

  async update(id: string, data: UpdateCursoData): Promise<Curso> {
    const response = await api.patch<Curso>(`${API_URL}/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },

  async getCarreras(): Promise<string[]> {
    const response = await api.get<string[]>(`${API_URL}/carreras`);
    return response.data;
  },

  async getModalidades(): Promise<string[]> {
    const response = await api.get<string[]>(`${API_URL}/modalidades`);
    return response.data;
  },
};
