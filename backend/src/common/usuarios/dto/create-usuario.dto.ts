import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiPropertyOptional({ description: 'Documento de identidad' })
  @IsString()
  @IsNotEmpty()
  documentoIdentidad: string;

  @ApiPropertyOptional({ description: 'Correo personal del usuario' })
  @IsString()
  @IsNotEmpty()
  correoPersonal: string;

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
