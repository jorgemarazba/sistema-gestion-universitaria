import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type TipoNotificacion = 'pago' | 'ticket' | 'solicitud' | 'sistema';
export type EstadoNotificacion = 'pendiente' | 'leida' | 'archivada';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['pago', 'ticket', 'solicitud', 'sistema'],
    default: 'sistema',
  })
  tipo: TipoNotificacion;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'leida', 'archivada'],
    default: 'pendiente',
  })
  estado: EstadoNotificacion;

  @Column({ nullable: true })
  usuarioId: string;

  @Column({ nullable: true })
  entidadId: string;

  @Column({ nullable: true })
  entidadTipo: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  paraAdmin: boolean;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
