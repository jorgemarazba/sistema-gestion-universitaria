import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum NivelCurso {
  PREGRADO = 'pregrado',
  POSGRADO = 'posgrado',
  DIPLOMADO = 'diplomado',
}

export enum EstadoCurso {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EN_PLANEACION = 'en_planeacion',
}

export enum ModalidadCurso {
  PRESENCIAL = 'presencial',
  VIRTUAL = 'virtual',
  HIBRIDO = 'hibrido',
}

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  codigo: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  carrera: string;

  @Column({ type: 'enum', enum: NivelCurso, default: NivelCurso.PREGRADO })
  nivel: NivelCurso;

  @Column({ type: 'enum', enum: EstadoCurso, default: EstadoCurso.ACTIVO })
  estado: EstadoCurso;

  @Column({ type: 'int', nullable: true })
  creditos: number;

  @Column({ type: 'int', nullable: true })
  semestre: number;

  @Column({ nullable: true, name: 'profesor_id' })
  profesorId: string;

  @Column({ nullable: true, name: 'programa_id' })
  programaId: string;

  @Column({ type: 'enum', enum: ModalidadCurso, default: ModalidadCurso.PRESENCIAL })
  modalidad: ModalidadCurso;

  @Column({ type: 'int', nullable: true, default: 0 })
  cupos: number;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}
