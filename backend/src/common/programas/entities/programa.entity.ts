import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoPrograma {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EN_PLANEACION = 'en_planeacion',
}

export enum NivelPrograma {
  PREGRADO = 'pregrado',
  POSGRADO = 'posgrado',
  DIPLOMADO = 'diplomado',
  ESPECIALIZACION = 'especializacion',
  MAESTRIA = 'maestria',
  DOCTORADO = 'doctorado',
}

@Entity('programas')
export class Programa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int' })
  semestres: number;

  @Column({ type: 'int', default: 0 })
  cursos: number;

  @Column({ type: 'int', default: 0 })
  estudiantes: number;

  @Column({ type: 'enum', enum: EstadoPrograma, default: EstadoPrograma.ACTIVO })
  estado: EstadoPrograma;

  @Column({ type: 'enum', enum: NivelPrograma, default: NivelPrograma.PREGRADO })
  nivel: NivelPrograma;

  @Column({ type: 'int', nullable: true })
  creditosTotales: number;

  @Column({ nullable: true })
  coordinadorId: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
