import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { NivelCurso } from '../entities/curso.entity';

export class CreateCursoDto {
  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  carrera: string;

  @IsOptional()
  @IsEnum(NivelCurso)
  nivel?: NivelCurso;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  creditos?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  semestre?: number;

  @IsOptional()
  @IsString()
  profesorId?: string;
}
