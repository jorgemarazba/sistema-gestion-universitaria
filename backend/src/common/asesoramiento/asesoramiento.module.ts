import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsesoramientoController } from './asesoramiento.controller';
import { AsesoramientoService } from './asesoramiento.service';
import { Asesoramiento } from './entities/asesoramiento.entity';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { MailModule } from '../mail/mail.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asesoramiento]),
    NotificacionesModule,
    MailModule,
    StorageModule,
  ],
  controllers: [AsesoramientoController],
  providers: [AsesoramientoService],
  exports: [AsesoramientoService],
})
export class AsesoramientoModule {}
