import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ name: 'documento_identidad', unique: true })
  documentoIdentidad: string;

  @Column({ name: 'correo_institucional', unique: true, nullable: true })
  correoInstitucional: string;

  @Column({ name: 'correo_personal', unique: true })
  correoPersonal: string;

  @Column({ name: 'contrasena', select: false, nullable: true })
  contrasena: string;

  @Column({ type: 'text', default: 'estudiante' })
  rol: string;

  @Column({ type: 'text', default: 'pendiente' })
  estado: string;

  @Column({ name: 'motivo_solicitud', nullable: true })
  motivoSolicitud: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;
}
