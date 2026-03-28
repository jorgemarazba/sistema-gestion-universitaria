import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { Notificacion } from './entities/notificacion.entity';

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
