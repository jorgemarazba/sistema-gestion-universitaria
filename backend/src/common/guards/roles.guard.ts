import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos desde el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no tiene el decorador @Roles, se permite el acceso
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener el usuario de la petición (inyectado previamente por el AuthGuard)
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { rol?: string } }>();
    const user = request.user;

    // 3. Validar si el rol del usuario coincide con los permitidos
    const userRol = user?.rol ?? '';
    const hasRole = requiredRoles.some((role) => userRol.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso (RV002)',
      );
    }

    return true;
  }
}
