import { SetMetadata } from '@nestjs/common';

// Esta es la clave que usaremos para identificar los roles
export const ROLES_KEY = 'roles';

// El decorador acepta una lista de roles: 'administrador', 'estudiante', 'docente'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
