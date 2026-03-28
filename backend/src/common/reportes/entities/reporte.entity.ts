import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum TipoReporte {
  ACADEMICO = 'academico',
  FINANCIERO = 'financiero',
  USUARIOS = 'usuarios',
  CURSOS = 'cursos',
  GENERAL = 'general',
}

export enum EstadoReporte {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  ERROR = 'error',
}

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'enum', enum: TipoReporte })
  tipo: TipoReporte;

  @Column({ type: 'enum', enum: EstadoReporte, default: EstadoReporte.PENDIENTE })
  estado: EstadoReporte;

  @Column({ type: 'json', nullable: true })
  filtros: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  resultado: string;

  @Column()
  creadoPor: string;

  @CreateDateColumn()
  creadoEn: Date;
}
