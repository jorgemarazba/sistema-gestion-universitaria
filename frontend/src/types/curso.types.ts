export const NivelCurso = {
  BASICO: 'basico',
  PREGRADO: 'pregrado',
  POSGRADO: 'posgrado',
  DIPLOMADO: 'diplomado',
} as const;

export type NivelCursoType = typeof NivelCurso[keyof typeof NivelCurso];

export const EstadoCurso = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  EN_PLANEACION: 'en_planeacion',
} as const;

export type EstadoCursoType = typeof EstadoCurso[keyof typeof EstadoCurso];

export const ModalidadCurso = {
  PRESENCIAL: 'presencial',
  VIRTUAL: 'virtual',
  HIBRIDO: 'hibrido',
} as const;

export type ModalidadCursoType = typeof ModalidadCurso[keyof typeof ModalidadCurso];

export interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  carrera: string;
  nivel: NivelCursoType;
  estado: EstadoCursoType;
  modalidad: ModalidadCursoType;
  creditos?: number;
  semestre?: number;
  cupos?: number;
  profesorId?: string;
  programaId?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateCursoData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  carrera: string;
  nivel?: NivelCursoType;
  modalidad?: ModalidadCursoType;
  creditos?: number;
  semestre?: number;
  cupos?: number;
  profesorId?: string;
  programaId?: string;
}

export interface UpdateCursoData extends Partial<CreateCursoData> {
  estado?: EstadoCursoType;
}
