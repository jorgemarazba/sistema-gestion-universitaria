import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { MailService } from '../mail/mail.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import {
  generarContrasenaTemporal,
  generarCorreoInstitucional,
} from '../utils/password.utils';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    private readonly mailService: MailService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async registrarSolicitud(dto: CreateSolicitudDto) {
    const existe = await this.usuariosRepo.findOne({
      where: [
        { documentoIdentidad: dto.documento_identidad },
        { correoPersonal: dto.correo_personal },
      ],
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe una solicitud o usuario con estos datos.',
      );
    }

    const nuevaSolicitud = this.usuariosRepo.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      documentoIdentidad: dto.documento_identidad,
      correoPersonal: dto.correo_personal,
      telefono: dto.telefono,
      rol: dto.tipo_usuario === 'docente' ? 'profesor' : 'estudiante',
      motivoSolicitud: dto.motivo,
      estado: 'pendiente',
    });

    const usuarioGuardado = await this.usuariosRepo.save(nuevaSolicitud);

    // Crear notificación para admin
    await this.notificacionesService.notificarNuevaSolicitud(
      usuarioGuardado.id_usuario,
      `${dto.nombre} ${dto.apellido}`,
      dto.tipo_usuario,
    );

    return usuarioGuardado;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub pendiente
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return this.usuariosRepo.find();
  }

  findOne(id: string) {
    return this.usuariosRepo.findOne({ where: { id_usuario: id } });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub pendiente
  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: string) {
    return `This action removes a #${id} usuario`;
  }

  // ==================== MÉTODOS PARA ADMIN STATS ====================

  /**
   * Obtener métricas globales para el Dashboard del Admin
   */
  async getAdminStats() {
    const totalUsers = await this.usuariosRepo.count();
    const pendingRequests = await this.usuariosRepo.count({
      where: { estado: 'pendiente' },
    });
    const activeUsers = await this.usuariosRepo.count({
      where: { estado: 'activo' },
    });

    return {
      totalUsers,
      pendingRequests,
      activeUsers,
      activeCourses: 45, // Esto vendrá del CursosService en el futuro
      alerts: 2, // Lógica personalizada de alertas
    };
  }

  /**
   * Obtener distribución de usuarios por rol
   */
  async getRoleDistribution() {
    const distribution = await this.usuariosRepo
      .createQueryBuilder('usuario')
      .select('usuario.rol', 'role')
      .addSelect('COUNT(usuario.id_usuario)', 'count')
      .groupBy('usuario.rol')
      .getRawMany();

    return distribution.map((item) => ({
      role: item.role,
      count: parseInt(item.count, 10),
    }));
  }

  /**
   * Obtener lista de usuarios pendientes de aprobación
   */
  async getPendingSolicitudes() {
    return await this.usuariosRepo.find({
      where: { estado: 'pendiente' },
      order: { fechaRegistro: 'DESC' },
    });
  }

  /**
   * Obtener lista de usuarios recientes
   */
  async findRecientes(limite: number = 5): Promise<Usuario[]> {
    return await this.usuariosRepo.find({
      order: { fechaRegistro: 'DESC' },
      take: limite,
    });
  }

  async getEstadisticas(): Promise<{ totalUsuarios: number; usuariosActivos: number; usuariosPendientes: number; usuariosSuspendidos: number }> {
    const totalUsuarios = await this.usuariosRepo.count();
    const usuariosActivos = await this.usuariosRepo.count({ where: { estado: 'activo' } });
    const usuariosPendientes = await this.usuariosRepo.count({ where: { estado: 'pendiente' } });
    const usuariosSuspendidos = await this.usuariosRepo.count({ where: { estado: 'suspendido' } });
    return { totalUsuarios, usuariosActivos, usuariosPendientes, usuariosSuspendidos };
  }

  async getDistribucionRoles(): Promise<{ rol: string; cantidad: number }[]> {
    const usuarios = await this.usuariosRepo.find();
    const distribucion = usuarios.reduce((acc, usuario) => {
      const rol = usuario.rol || 'desconocido';
      acc[rol] = (acc[rol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(distribucion).map(([rol, cantidad]) => ({ rol, cantidad }));
  }

  /**
   * Actualizar el estado de un usuario (aprobar/rechazar)
   * Si es 'activo': genera correo institucional, contraseña temporal y envía email
   * Si es 'rechazado': requiere motivo y envía notificación
   */
  async updateStatus(
    id: string,
    status: 'activo' | 'rechazado',
    motivoRechazo?: string,
  ) {
    const usuario = await this.usuariosRepo.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (status === 'activo') {
      return this.aprobarUsuario(usuario);
    } else if (status === 'rechazado') {
      return this.rechazarUsuario(usuario, motivoRechazo);
    }

    throw new BadRequestException('Estado inválido');
  }

  /**
   * Procesar aprobación de un usuario
   * Genera correo institucional, contraseña temporal y envía credenciales
   */
  private async aprobarUsuario(usuario: Usuario) {
    try {
      // 1. Generar correo institucional
      const correoInstitucional = generarCorreoInstitucional(
        usuario.nombre,
        usuario.apellido,
        'universidad.edu',
      );

      // 2. Generar contraseña temporal (12 caracteres)
      const passwordTemporal = generarContrasenaTemporal(12);

      // 3. Hashear contraseña con salt de 10 rondas
      const hashPassword = await bcrypt.hash(passwordTemporal, 10);

      // 4. Actualizar usuario en BD
      usuario.correoInstitucional = correoInstitucional;
      usuario.contrasena = hashPassword;
      usuario.estado = 'activo';
      usuario.fechaAprobacion = new Date();

      const usuarioActualizado = await this.usuariosRepo.save(usuario);

      console.log(`✅ Usuario aprobado: ${usuario.id_usuario}`);
      console.log(`📧 Correo generado: ${correoInstitucional}`);

      // 5. Enviar email con credenciales
      await this.mailService.enviarCredenciales(
        usuario.correoPersonal,
        usuario.nombre,
        usuario.apellido,
        correoInstitucional,
        passwordTemporal,
      );

      console.log(
        `✉️ Email de credenciales enviado a: ${usuario.correoPersonal}`,
      );

      // 6. Retornar usuario sin la contraseña
      const { contrasena, ...usuarioSinPassword } = usuarioActualizado;
      return usuarioSinPassword;
    } catch (error) {
      console.error('❌ Error al aprobar usuario:', error);
      throw new BadRequestException(
        `Error procesando aprobación: ${error.message}`,
      );
    }
  }

  /**
   * Reenviar credenciales a un usuario activo
   * Genera nueva contraseña temporal y la envía por email
   */
  async reenviarCredenciales(id: string) {
    const usuario = await this.usuariosRepo.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (usuario.estado !== 'activo') {
      throw new BadRequestException('Solo se pueden reenviar credenciales a usuarios activos');
    }

    try {
      // 1. Generar nueva contraseña temporal
      const nuevaPasswordTemporal = generarContrasenaTemporal(12);

      // 2. Hashear nueva contraseña
      const hashPassword = await bcrypt.hash(nuevaPasswordTemporal, 10);

      // 3. Actualizar contraseña en BD
      usuario.contrasena = hashPassword;
      await this.usuariosRepo.save(usuario);

      console.log(`🔄 Credenciales regeneradas para usuario: ${usuario.id_usuario}`);

      // 4. Enviar email con nuevas credenciales
      await this.mailService.enviarCredenciales(
        usuario.correoPersonal,
        usuario.nombre,
        usuario.apellido,
        usuario.correoInstitucional,
        nuevaPasswordTemporal,
      );

      console.log(`✉️ Nuevas credenciales enviadas a: ${usuario.correoPersonal}`);

      return {
        success: true,
        message: 'Credenciales reenviadas exitosamente',
      };
    } catch (error) {
      console.error('❌ Error al reenviar credenciales:', error);
      throw new BadRequestException(
        `Error reenviando credenciales: ${error.message}`,
      );
    }
  }

  /**
   * Procesar rechazo de un usuario
   * Guarda el motivo y envía notificación
   */
  private async rechazarUsuario(usuario: Usuario, motivo?: string) {
    try {
      if (!motivo) {
        throw new BadRequestException('Debe proporcionar un motivo de rechazo');
      }

      // 1. Actualizar estado en BD
      usuario.estado = 'rechazado';
      usuario.motivoRechazo = motivo;

      const usuarioActualizado = await this.usuariosRepo.save(usuario);

      console.log(`❌ Usuario rechazado: ${usuario.id_usuario}`);
      console.log(`📋 Motivo: ${motivo}`);

      // 2. Enviar email de notificación
      await this.mailService.enviarRechazo(
        usuario.correoPersonal,
        usuario.nombre,
        motivo,
      );

      console.log(`✉️ Email de rechazo enviado a: ${usuario.correoPersonal}`);

      return usuarioActualizado;
    } catch (error) {
      console.error('❌ Error al rechazar usuario:', error);
      throw new BadRequestException(
        `Error procesando rechazo: ${error.message}`,
      );
    }
  }
}
