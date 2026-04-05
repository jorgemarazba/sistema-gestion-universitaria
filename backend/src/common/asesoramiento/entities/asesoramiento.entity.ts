import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type EstadoAsesoramiento = 'pendiente' | 'respondido' | 'cerrado';

@Entity('asesoramientos')
export class Asesoramiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  email: string;

  @Column()
  telefono: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @Column({
    type: 'enum',
    enum: ['presencial', 'virtual', 'hibrida'],
  })
  modalidad: string;

  @Column()
  programa: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'respondido', 'cerrado'],
    default: 'pendiente',
  })
  estado: EstadoAsesoramiento;

  @Column({ type: 'text', nullable: true })
  respuesta: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'simple-json', nullable: true })
  archivos: { nombre: string; url: string; tipo: string; key?: string; storage?: string }[];

  @Column({ nullable: true })
  respondidoEn: Date;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
