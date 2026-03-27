import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // ==================== PUBLIC ENDPOINTS ====================

  @Post('solicitar-acceso')
  @ApiOperation({ summary: 'Crear solicitud de acceso al sistema' })
  crearSolicitud(@Body() dto: CreateSolicitudDto) {
    return this.usuariosService.registrarSolicitud(dto);
  }

  // ==================== ADMIN STATS ENDPOINTS ====================

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Obtener métricas globales para el dashboard' })
  getStats() {
    return this.usuariosService.getAdminStats();
  }

  @Get('dashboard/roles')
  @ApiOperation({ summary: 'Obtener distribución de usuarios por rol' })
  getRoles() {
    return this.usuariosService.getRoleDistribution();
  }

  @Get('pendientes')
  @ApiOperation({ summary: 'Listar usuarios pendientes de aprobación' })
  findPendientes() {
    return this.usuariosService.getPendingSolicitudes();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Aprobar o rechazar una solicitud de usuario' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'activo' | 'rechazado',
    @Body('motivoRechazo') motivoRechazo?: string,
  ) {
    return this.usuariosService.updateStatus(id, status, motivoRechazo);
  }

  @Post(':id/reenviar-credenciales')
  @ApiOperation({ summary: 'Reenviar credenciales a un usuario activo' })
  reenviarCredenciales(@Param('id') id: string) {
    return this.usuariosService.reenviarCredenciales(id);
  }

  // ==================== CRUD BASIC ENDPOINTS ====================

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todos los usuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de un usuario específico' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
