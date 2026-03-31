import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { NivelPrograma, EstadoPrograma } from '../entities/programa.entity';

export class CreateProgramaDto {
  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  @Min(1)
  @Max(12)
  semestres: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cursos?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  estudiantes?: number;

  @IsOptional()
  @IsEnum(EstadoPrograma)
  estado?: EstadoPrograma;

  @IsOptional()
  @IsEnum(NivelPrograma)
  nivel?: NivelPrograma;

  @IsOptional()
  @IsInt()
  @Min(1)
  creditosTotales?: number;

  @IsOptional()
  @IsString()
  coordinadorId?: string;
}
