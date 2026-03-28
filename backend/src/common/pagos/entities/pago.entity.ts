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

export type EstadoPago = 'pendiente' | 'procesado' | 'vencido' | 'cancelado';
export type MetodoPago = 'transferencia' | 'tarjeta' | 'efectivo' | 'paypal';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  concepto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'procesado', 'vencido', 'cancelado'],
    default: 'pendiente',
  })
  estado: EstadoPago;

  @Column({
    type: 'enum',
    enum: ['transferencia', 'tarjeta', 'efectivo', 'paypal'],
    nullable: true,
  })
  metodoPago: MetodoPago;

  @Column({ type: 'timestamp', nullable: true })
  fechaVencimiento: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaPago: Date;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ nullable: true })
  referencia: string;

  @Column({ type: 'text', nullable: true })
  comprobante: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
