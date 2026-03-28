import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion, TipoNotificacion } from './entities/notificacion.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private notificacionesRepo: Repository<Notificacion>,
  ) {}

  async crearNotificacion(data: {
    titulo: string;
    descripcion: string;
    tipo: TipoNotificacion;
    usuarioId?: string;
    entidadId?: string;
    entidadTipo?: string;
    paraAdmin?: boolean;
    metadata?: Record<string, any>;
  }): Promise<Notificacion> {
    const notificacion = this.notificacionesRepo.create({
      ...data,
      estado: 'pendiente',
    });
    return await this.notificacionesRepo.save(notificacion);
  }

  async obtenerNotificacionesPorUsuario(usuarioId: string): Promise<Notificacion[]> {
    return await this.notificacionesRepo.find({
      where: [
        { usuarioId, estado: 'pendiente' },
        { usuarioId, estado: 'leida' },
      ],
      order: { creadoEn: 'DESC' },
      take: 20,
    });
  }

  async obtenerNotificacionesAdmin(): Promise<Notificacion[]> {
    return await this.notificacionesRepo.find({
      where: { paraAdmin: true, estado: 'pendiente' },
      order: { creadoEn: 'DESC' },
      take: 20,
    });
  }

  async obtenerTodasLasNotificaciones(): Promise<Notificacion[]> {
    return await this.notificacionesRepo.find({
      order: { creadoEn: 'DESC' },
      take: 50,
    });
  }

  async marcarComoLeida(id: string): Promise<Notificacion> {
    const notificacion = await this.notificacionesRepo.findOne({ where: { id } });
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }
    notificacion.estado = 'leida';
    return await this.notificacionesRepo.save(notificacion);
  }

  async marcarTodasComoLeidas(usuarioId?: string): Promise<void> {
    if (usuarioId) {
      await this.notificacionesRepo.update(
        { usuarioId, estado: 'pendiente' },
        { estado: 'leida' }
      );
    } else {
      await this.notificacionesRepo.update(
        { estado: 'pendiente' },
        { estado: 'leida' }
      );
    }
  }

  async contarNotificacionesPendientes(usuarioId?: string): Promise<number> {
    if (usuarioId) {
      return await this.notificacionesRepo.count({
        where: { usuarioId, estado: 'pendiente' },
      });
    }
    return await this.notificacionesRepo.count({
      where: { paraAdmin: true, estado: 'pendiente' },
    });
  }

  // Métodos específicos para crear notificaciones de diferentes tipos
  async notificarNuevoPago(usuarioId: string, nombreUsuario: string, monto: number): Promise<Notificacion> {
    return await this.crearNotificacion({
      titulo: 'Nuevo pago registrado',
      descripcion: `${nombreUsuario} ha realizado un pago de $${monto}`,
      tipo: 'pago',
      usuarioId,
      paraAdmin: true,
      metadata: { monto },
    });
  }

  async notificarNuevoTicket(usuarioId: string, nombreUsuario: string, asunto: string): Promise<Notificacion> {
    return await this.crearNotificacion({
      titulo: 'Nuevo ticket de soporte',
      descripcion: `${nombreUsuario}: ${asunto}`,
      tipo: 'ticket',
      usuarioId,
      paraAdmin: true,
      metadata: { asunto },
    });
  }

  async notificarNuevaSolicitud(usuarioId: string, nombreUsuario: string, tipo: string): Promise<Notificacion> {
    return await this.crearNotificacion({
      titulo: 'Nueva solicitud de cuenta',
      descripcion: `${nombreUsuario} solicitó acceso como ${tipo}`,
      tipo: 'solicitud',
      usuarioId,
      paraAdmin: true,
      metadata: { tipoSolicitud: tipo },
    });
  }

  async notificarSolicitudAprobada(usuarioId: string, correoInstitucional: string): Promise<Notificacion> {
    return await this.crearNotificacion({
      titulo: 'Solicitud aprobada',
      descripcion: `Tu solicitud fue aprobada. Correo: ${correoInstitucional}`,
      tipo: 'solicitud',
      usuarioId,
      paraAdmin: false,
      metadata: { correoInstitucional },
    });
  }
}
