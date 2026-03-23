import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'Ingresa un correo válido' })
  correo: string

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena: string
}
