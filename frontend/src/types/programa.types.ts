export interface Programa {
  id: string;
  nombre: string;
  nivel: string;
  descripcion?: string;
  duracion?: number;
  estado?: string;
}

export interface CreateProgramaData {
  nombre: string;
  nivel: string;
  descripcion?: string;
  duracion?: number;
}

export interface UpdateProgramaData {
  nombre?: string;
  nivel?: string;
  descripcion?: string;
  duracion?: number;
  estado?: string;
}
