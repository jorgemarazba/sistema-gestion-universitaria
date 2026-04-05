import { Controller, Post, Get, Body, Param, Patch, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { B2StorageService } from '../storage/b2-storage.service';
import { AsesoramientoService } from './asesoramiento.service';

@ApiTags('Asesoramiento')
@Controller('asesoramiento')
export class AsesoramientoController {
  constructor(
    private readonly asesoramientoService: AsesoramientoService,
    private readonly b2Storage: B2StorageService,
  ) {}

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
  @ApiOperation({ summary: 'Subir archivos adjuntos a una solicitud (Cloudflare R2)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('archivos', 5))
  async subirArchivos(
    @Param('id') id: string,
    @UploadedFiles() archivos: any[],
  ) {
    console.log(`[Controller] Subiendo ${archivos?.length || 0} archivos para asesoramiento ${id}`);
    
    try {
      const uploadedFiles: { nombre: string; url: string; key: string; tipo: string }[] = [];

      for (const archivo of archivos) {
        console.log(`[Controller] Procesando archivo: ${archivo?.originalname}, tipo: ${archivo?.mimetype}, size: ${archivo?.size}`);
        const { url, key } = await this.b2Storage.uploadFile(archivo, `asesoramiento/${id}`);
        uploadedFiles.push({
          nombre: archivo.originalname,
          url,
          key,
          tipo: archivo.mimetype,
        });
        console.log(`[Controller] Archivo subido exitosamente: ${key}`);
      }

      console.log(`[Controller] Llamando a subirArchivosR2 con ${uploadedFiles.length} archivos`);
      const result = await this.asesoramientoService.subirArchivosR2(id, uploadedFiles);
      console.log(`[Controller] Resultado de subirArchivosR2:`, result);
      return result;
    } catch (error) {
      console.error('[Controller] ERROR al subir archivos:', error);
      throw error;
    }
  }

  @Delete(':id/archivos/:key')
  @ApiOperation({ summary: 'Eliminar un archivo adjunto de R2' })
  async eliminarArchivo(
    @Param('id') id: string,
    @Param('key') key: string,
  ) {
    await this.b2Storage.deleteFile(key);
    return this.asesoramientoService.eliminarArchivoR2(id, key);
  }
}
