import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Reporte } from './entities/reporte.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Pago } from '../pagos/entities/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reporte, Usuario, Curso, Pago])],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}
