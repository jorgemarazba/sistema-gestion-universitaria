import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export type EstadoTicket = 'abierto' | 'en_proceso' | 'escalado' | 'resuelto' | 'cerrado';
export type PrioridadTicket = 'baja' | 'media' | 'alta' | 'critica';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  asunto: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['abierto', 'en_proceso', 'escalado', 'resuelto', 'cerrado'],
    default: 'abierto',
  })
  estado: EstadoTicket;

  @Column({
    type: 'enum',
    enum: ['baja', 'media', 'alta', 'critica'],
    default: 'media',
  })
  prioridad: PrioridadTicket;

  @Column({ nullable: true })
  categoria: string;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ nullable: true })
  asignadoA: string;

  @Column({ type: 'text', nullable: true })
  respuesta: string;

  @Column({ type: 'timestamp', nullable: true })
  resueltoEn: Date;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
