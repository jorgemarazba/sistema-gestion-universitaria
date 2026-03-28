import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { TipoReporte } from '../entities/reporte.entity';

export class CreateReporteDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsEnum(TipoReporte)
  tipo: TipoReporte;

  @IsOptional()
  @IsObject()
  filtros?: Record<string, any>;

  @IsString()
  creadoPor: string;
}
