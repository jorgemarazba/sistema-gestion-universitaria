import { Controller, Post, Get, Body, Param, Patch, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AsesoramientoService } from './asesoramiento.service';

@ApiTags('Asesoramiento')
@Controller('asesoramiento')
export class AsesoramientoController {
  constructor(private readonly asesoramientoService: AsesoramientoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva solicitud de asesoramiento' })
  async crearSolicitud(
    @Body() data: {
      nombres: string;
      apellidos: string;
      email: string;
      telefono: string;
      pais: string;
      ciudad: string;
      modalidad: string;
      programa: string;
    },
  ) {
    return this.asesoramientoService.crearSolicitud(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de asesoramiento' })
  async findAll() {
    return this.asesoramientoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por ID' })
  async findById(@Param('id') id: string) {
    return this.asesoramientoService.findById(id);
  }

  @Patch(':id/responder')
  @ApiOperation({ summary: 'Responder una solicitud de asesoramiento' })
  async responder(
    @Param('id') id: string,
    @Body('respuesta') respuesta: string,
  ) {
    return this.asesoramientoService.responderSolicitud(id, respuesta);
  }

  @Patch(':id/cerrar')
  @ApiOperation({ summary: 'Cerrar una solicitud de asesoramiento' })
  async cerrar(@Param('id') id: string) {
    return this.asesoramientoService.cerrarSolicitud(id);
  }

  @Patch(':id/notas')
  @ApiOperation({ summary: 'Guardar notas de una solicitud de asesoramiento' })
  async guardarNotas(
    @Param('id') id: string,
    @Body('notas') notas: string,
  ) {
    return this.asesoramientoService.guardarNotas(id, notas);
  }

  @Post(':id/responder-email')
  @ApiOperation({ summary: 'Enviar email automático con información del programa' })
  async responderEmail(
    @Param('id') id: string,
    @Body('mensaje') mensaje: string,
  ) {
    return this.asesoramientoService.enviarEmailRespuesta(id, mensaje);
  }

  @Get(':id/template-email')
  @ApiOperation({ summary: 'Obtener template de email pre-poblado según el programa' })
  async obtenerTemplateEmail(@Param('id') id: string) {
    return this.asesoramientoService.obtenerTemplateEmail(id);
  }

  @Post(':id/archivos')
  @ApiOperation({ summary: 'Subir archivos adjuntos a una solicitud' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('archivos', 5))
  async subirArchivos(
    @Param('id') id: string,
    @UploadedFiles() archivos: any[],
  ) {
    return this.asesoramientoService.subirArchivos(id, archivos);
  }

  @Delete(':id/archivos/:archivoNombre')
  @ApiOperation({ summary: 'Eliminar un archivo adjunto' })
  async eliminarArchivo(
    @Param('id') id: string,
    @Param('archivoNombre') archivoNombre: string,
  ) {
    return this.asesoramientoService.eliminarArchivo(id, archivoNombre);
  }
}
