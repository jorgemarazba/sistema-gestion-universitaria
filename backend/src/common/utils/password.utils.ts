/**
 * Utilidades para manejo de contraseñas y datos de usuario
 */

import * as crypto from 'crypto';

/**
 * Generar contraseña temporal aleatoria
 * @param length Largo de la contraseña (default: 12)
 * @returns Contraseña aleatoria con mayúsculas, minúsculas, números y símbolos
 */
export function generarContrasenaTemporal(length: number = 12): string {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const simbolos = '!@#$%^&*';

  const todosLosCaracteres = mayusculas + minusculas + numeros + simbolos;

  let contrasena = '';

  // Garantizar al menos un carácter de cada tipo
  contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
  contrasena += numeros[Math.floor(Math.random() * numeros.length)];
  contrasena += simbolos[Math.floor(Math.random() * simbolos.length)];

  // Completar el resto aleatoriamente
  for (let i = contrasena.length; i < length; i++) {
    contrasena += todosLosCaracteres[
      Math.floor(Math.random() * todosLosCaracteres.length)
    ];
  }

  // Desordenar la contraseña
  return contrasena
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Generar correo institucional basado en nombre y apellido
 * @param nombre Nombre del usuario
 * @param apellido Apellido del usuario
 * @param dominioInstitucional Dominio de la institución (default: universidad.edu)
 * @returns Correo institucional en formato: nombre.apellido@institucion.edu
 */
export function generarCorreoInstitucional(
  nombre: string,
  apellido: string,
  dominioInstitucional: string = 'universidad.edu',
): string {
  // Normalizar: convertir a minúsculas, remover acentos
  const normalizarTexto = (texto: string): string => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
      .replace(/[^a-z0-9]/g, ''); // Remover caracteres especiales
  };

  const nombreNormal = normalizarTexto(nombre);
  const apellidoNormal = normalizarTexto(apellido);

  return `${nombreNormal}.${apellidoNormal}@${dominioInstitucional}`;
}

/**
 * Validar que el correo institucional sea único
 * Útil para manejar colisiones
 * @param email Email a validar
 * @param emailsExistentes Array de emails ya existentes
 * @returns Email único (si hay colisión, agrega número)
 */
export function asegurarCorreoUnico(
  email: string,
  emailsExistentes: string[],
): string {
  if (!emailsExistentes.includes(email)) {
    return email;
  }

  // Si hay colisión, agregar número
  const [parte, dominio] = email.split('@');
  let contador = 1;

  while (emailsExistentes.includes(`${parte}${contador}@${dominio}`)) {
    contador++;
  }

  return `${parte}${contador}@${dominio}`;
}

/**
 * Generar token de verificación para cambio de contraseña
 * @returns Token de 32 caracteres hexadecimales
 */
export function generarTokenVerificacion(): string {
  return crypto.randomBytes(16).toString('hex');
}
