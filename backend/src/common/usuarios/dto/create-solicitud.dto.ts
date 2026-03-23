import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateSolicitudDto {
  @IsString()
  @MinLength(2, { message: 'Nombre demasiado corto' })
  nombre: string;

  @IsString()
  @MinLength(2, { message: 'Apellido demasiado corto' })
  apellido: string;

  @IsString()
  @MinLength(5, { message: 'Documento no válido' })
  documento_identidad: string;

  @IsEmail({}, { message: 'Ingresa un correo personal válido' })
  correo_personal: string;

  @IsEnum(['estudiante', 'docente'], {
    message: 'Tipo de usuario debe ser estudiante o docente',
  })
  tipo_usuario: 'estudiante' | 'docente';

  @IsString()
  @MinLength(10, {
    message: 'Por favor, describe brevemente tu facultad o área',
  })
  motivo: string;
}
