import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Notificacion, TipoNotificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private notificacionesRepo: Repository<Notificacion>,
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private mailService: MailService,
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

  // Crear notificaciones masivas según destinatarios
  async crearNotificacionMasiva(data: {
    titulo: string;
    descripcion: string;
    tipo: TipoNotificacion;
    destinatarios: string; // 'todos', 'estudiantes', 'profesores', 'admin'
    enviarEmail?: boolean;
    metadata?: Record<string, any>;
  }): Promise<{ cantidad: number; notificaciones: Notificacion[] }> {
    const { titulo, descripcion, tipo, destinatarios, enviarEmail, metadata } = data;
    
    console.log(`📧 [Notificaciones] Iniciando envío masivo:`);
    console.log(`   - Destinatarios: ${destinatarios}`);
    console.log(`   - Enviar email: ${enviarEmail}`);
    
    // Buscar usuarios según el tipo de destinatario
    let usuarios: Usuario[] = [];
    
    switch (destinatarios) {
      case 'todos':
        usuarios = await this.usuariosRepo.find({ 
          where: { estado: 'activo', rol: Not('administrador') } 
        });
        break;
      case 'estudiantes':
        usuarios = await this.usuariosRepo.find({ 
          where: { rol: 'estudiante', estado: 'activo' } 
        });
        break;
      case 'profesores':
        usuarios = await this.usuariosRepo.find({ 
          where: { rol: 'profesor', estado: 'activo' } 
        });
        break;
      case 'admin':
        usuarios = await this.usuariosRepo.find({ 
          where: { rol: 'administrador', estado: 'activo' } 
        });
        break;
      default:
        // Si es un ID específico de usuario
        const usuario = await this.usuariosRepo.findOne({ where: { id_usuario: destinatarios } });
        if (usuario) usuarios = [usuario];
    }

    // Debug: mostrar usuarios encontrados
    console.log(`   - Usuarios encontrados: ${usuarios.length}`);
    usuarios.forEach(u => {
      console.log(`     * ${u.nombre} ${u.apellido} | Rol: ${u.rol} | Emails: ${u.correoInstitucional || 'N/A'}, ${u.correoPersonal || 'N/A'}`);
    });

    const notificacionesCreadas: Notificacion[] = [];
    let emailsEnviados = 0;
    let emailsFallidos = 0;

    // Crear notificación individual para cada usuario
    for (const usuario of usuarios) {
      const notificacion = await this.crearNotificacion({
        titulo,
        descripcion,
        tipo,
        usuarioId: usuario.id_usuario,
        metadata: { ...metadata, destinatarios },
      });
      notificacionesCreadas.push(notificacion);

      // Enviar email si se solicita
      if (enviarEmail === true) {
        const emails: string[] = [];
        
        if (usuario.correoInstitucional) {
          emails.push(usuario.correoInstitucional);
        }
        if (usuario.correoPersonal) {
          emails.push(usuario.correoPersonal);
        }
        
        for (const email of emails) {
          try {
            console.log(`📧 Enviando email a: ${email}`);
            await this.mailService.enviarNotificacion(
              email,
              titulo,
              descripcion,
            );
            console.log(`✅ Email enviado exitosamente a: ${email}`);
            emailsEnviados++;
          } catch (err) {
            console.error(`❌ Error al enviar email a ${email}:`, err.message);
            emailsFallidos++;
          }
        }
        
        if (emails.length === 0) {
          console.log(`⚠️ Usuario ${usuario.nombre} ${usuario.apellido} no tiene correos registrados`);
        }
      }
    }

    // Crear notificación para el admin con el resumen
    await this.crearNotificacion({
      titulo: `Notificación enviada: ${titulo}`,
      descripcion: `Enviaste esta notificación a ${usuarios.length} ${destinatarios}. ${emailsEnviados} emails enviados.`,
      tipo: 'sistema',
      paraAdmin: true,
      metadata: { 
        tipoEnvio: 'masivo', 
        destinatarios, 
        cantidadUsuarios: usuarios.length,
        emailsEnviados,
        tituloOriginal: titulo,
      },
    });

    console.log(`📊 Resumen: ${notificacionesCreadas.length} notificaciones, ${emailsEnviados} emails enviados, ${emailsFallidos} fallidos`);

    return { cantidad: notificacionesCreadas.length, notificaciones: notificacionesCreadas };
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
      where: [
        { paraAdmin: true, estado: 'pendiente' },
        { paraAdmin: true, estado: 'leida' },
      ],
      order: { creadoEn: 'DESC' },
      take: 50,
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

  // Obtener historial completo de notificaciones con filtros
  async obtenerHistorial(
    tipo?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Notificacion[]; total: number }> {
    const where: any = {};
    
    // Excluir notificaciones de resumen para el admin
    where.paraAdmin = false;
    
    if (tipo && tipo !== 'todos') {
      if (['pago', 'ticket', 'solicitud', 'sistema', 'info', 'warning', 'success', 'urgent'].includes(tipo)) {
        where.tipo = tipo;
      }
    }

    const [data, total] = await this.notificacionesRepo.findAndCount({
      where,
      order: { creadoEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  // Eliminar notificación
  async eliminarNotificacion(id: string): Promise<void> {
    const notificacion = await this.notificacionesRepo.findOne({ where: { id } });
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }
    await this.notificacionesRepo.remove(notificacion);
  }

  // Actualizar notificación
  async actualizarNotificacion(
    id: string,
    data: { titulo?: string; descripcion?: string; estado?: string },
  ): Promise<Notificacion> {
    const notificacion = await this.notificacionesRepo.findOne({ where: { id } });
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }
    
    if (data.titulo !== undefined) notificacion.titulo = data.titulo;
    if (data.descripcion !== undefined) notificacion.descripcion = data.descripcion;
    if (data.estado !== undefined) notificacion.estado = data.estado as any;
    notificacion.actualizadoEn = new Date();
    
    return await this.notificacionesRepo.save(notificacion);
  }

  // Reenviar notificación masiva
  async reenviarNotificacion(id: string): Promise<number> {
    const notificacionOriginal = await this.notificacionesRepo.findOne({ where: { id } });
    if (!notificacionOriginal) {
      throw new Error('Notificación no encontrada');
    }

    const destinatarios = notificacionOriginal.metadata?.destinatarios;
    if (!destinatarios || !['todos', 'estudiantes', 'profesores', 'admin'].includes(destinatarios)) {
      throw new Error('Esta notificación no es de tipo masiva');
    }

    // Reenviar usando el mismo método masivo
    const resultado = await this.crearNotificacionMasiva({
      titulo: notificacionOriginal.titulo,
      descripcion: notificacionOriginal.descripcion,
      tipo: notificacionOriginal.tipo,
      destinatarios: destinatarios,
      enviarEmail: true,
      metadata: { ...notificacionOriginal.metadata, reenvio: true, fechaOriginal: notificacionOriginal.creadoEn },
    });

    return resultado.cantidad;
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
