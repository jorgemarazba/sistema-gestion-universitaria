import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Apellido del usuario' })
  @IsString()
  @IsOptional()
  apellido?: string;

  @ApiPropertyOptional({ description: 'Documento de identidad' })
  @IsString()
  @IsOptional()
  documentoIdentidad?: string;

  @ApiPropertyOptional({ description: 'Correo personal del usuario' })
  @IsString()
  @IsOptional()
  correo_personal?: string;

  @ApiPropertyOptional({ description: 'Teléfono del usuario' })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({ description: 'Rol del usuario', enum: ['estudiante', 'profesor', 'administrador'] })
  @IsString()
  @IsOptional()
  rol?: string;

  @ApiPropertyOptional({ description: 'Estado del usuario', enum: ['activo', 'verificacion pendiente', 'suspendido', 'pendiente'] })
  @IsString()
  @IsOptional()
  estado?: string;
}
