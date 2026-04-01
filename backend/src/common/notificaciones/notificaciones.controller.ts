import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { Notificacion, TipoNotificacion } from './entities/notificacion.entity';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  async obtenerNotificaciones(
    @Query('usuarioId') usuarioId?: string,
    @Query('admin') admin?: string,
  ): Promise<Notificacion[]> {
    if (admin === 'true') {
      return await this.notificacionesService.obtenerNotificacionesAdmin();
    }
    if (usuarioId) {
      return await this.notificacionesService.obtenerNotificacionesPorUsuario(usuarioId);
    }
    return await this.notificacionesService.obtenerTodasLasNotificaciones();
  }

  @Get('historial')
  async obtenerHistorial(
    @Query('tipo') tipo?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ data: Notificacion[]; total: number }> {
    return await this.notificacionesService.obtenerHistorial(
      tipo,
      page || 1,
      limit || 20,
    );
  }

  @Post()
  async crearNotificacion(
    @Body() data: {
      titulo: string;
      descripcion: string;
      tipo: TipoNotificacion;
      usuarioId?: string;
      destinatarios?: string; // 'todos', 'estudiantes', 'profesores', 'admin'
      enviarEmail?: boolean;
      entidadId?: string;
      entidadTipo?: string;
      paraAdmin?: boolean;
      metadata?: Record<string, any>;
    },
  ): Promise<{ cantidad: number; notificaciones: Notificacion[] } | Notificacion> {
    // Si hay destinatarios de tipo grupo, usar el método masivo
    if (data.destinatarios && ['todos', 'estudiantes', 'profesores', 'admin'].includes(data.destinatarios)) {
      return await this.notificacionesService.crearNotificacionMasiva({
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        destinatarios: data.destinatarios,
        enviarEmail: data.enviarEmail,
        metadata: data.metadata,
      });
    }
    
    // Si es un usuario específico
    return await this.notificacionesService.crearNotificacion(data);
  }

  @Patch(':id')
  async actualizarNotificacion(
    @Param('id') id: string,
    @Body() data: { titulo?: string; descripcion?: string; estado?: string },
  ): Promise<Notificacion> {
    return await this.notificacionesService.actualizarNotificacion(id, data);
  }

  @Delete(':id')
  async eliminarNotificacion(@Param('id') id: string): Promise<{ mensaje: string }> {
    await this.notificacionesService.eliminarNotificacion(id);
    return { mensaje: 'Notificación eliminada correctamente' };
  }

  @Post(':id/reenviar')
  async reenviarNotificacion(@Param('id') id: string): Promise<{ cantidad: number }> {
    const resultado = await this.notificacionesService.reenviarNotificacion(id);
    return { cantidad: resultado };
  }

  @Get('contar-pendientes')
  async contarPendientes(
    @Query('usuarioId') usuarioId?: string,
  ): Promise<{ cantidad: number }> {
    const cantidad = await this.notificacionesService.contarNotificacionesPendientes(
      usuarioId,
    );
    return { cantidad };
  }

  @Post(':id/leer')
  async marcarComoLeida(@Param('id') id: string): Promise<Notificacion> {
    return await this.notificacionesService.marcarComoLeida(id);
  }

  @Post('marcar-todas-leidas')
  async marcarTodasComoLeidas(
    @Body('usuarioId') usuarioId?: string,
  ): Promise<{ mensaje: string }> {
    await this.notificacionesService.marcarTodasComoLeidas(usuarioId);
    return { mensaje: 'Todas las notificaciones marcadas como leídas' };
  }
}
