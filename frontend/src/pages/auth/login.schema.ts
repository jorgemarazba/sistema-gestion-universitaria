import { z } from 'zod'

/**
 * Validación de login en cliente (antes de enviar al servidor).
 * Campos alineados con `LoginDto` del backend: `correo`, `contrasena`.
 */
export const loginSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, 'Ingresa tu correo institucional')
    .email('Correo electrónico no válido')
    .max(255, 'El correo supera la longitud permitida')
    .toLowerCase(),

  contrasena: z
    .string()
    .min(1, 'Ingresa tu contraseña')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña supera la longitud permitida'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const loginDefaultValues: LoginFormValues = {
  correo: '',
  contrasena: '',
}
