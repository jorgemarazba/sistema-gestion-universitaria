import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { MailModule } from '../mail/mail.module';
import { PresenceModule } from '../presence/presence.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), NotificacionesModule, MailModule, PresenceModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}

