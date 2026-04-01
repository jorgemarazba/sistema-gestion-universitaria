import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion, Usuario])],
  controllers: [NotificacionesController],
  providers: [NotificacionesService, MailService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
