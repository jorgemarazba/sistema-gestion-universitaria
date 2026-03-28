import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './common/usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { NotificacionesModule } from './common/notificaciones/notificaciones.module';
import { TicketsModule } from './common/tickets/tickets.module';
import { PagosModule } from './common/pagos/pagos.module';
import { CursosModule } from './common/cursos/cursos.module';
import { ReportesModule } from './common/reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT') ?? 5432,
        username: config.get<string>('DB_USER') ?? config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    UsuariosModule,
    AuthModule,
    NotificacionesModule,
    TicketsModule,
    PagosModule,
    CursosModule,
    ReportesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
