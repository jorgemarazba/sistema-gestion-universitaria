import { z } from 'zod'

export const solicitudSchema = z.object({
  nombre: z.string().min(2, 'Nombre demasiado corto'),
  apellido: z.string().min(2, 'Apellido demasiado corto'),
  documento_identidad: z.string().min(5, 'Documento no válido'),
  correo_personal: z.string().email('Ingresa un correo personal válido'),
  telefono: z.string().min(10, 'Teléfono no válido'),
  tipo_usuario: z.enum(['estudiante', 'docente']),
  programa_id: z.string().min(1, 'Debes seleccionar una carrera'),
  motivo: z.string().min(10, 'Por favor, describe brevemente tu motivo de solicitud'),
})

export type SolicitudFormValues = z.infer<typeof solicitudSchema>
