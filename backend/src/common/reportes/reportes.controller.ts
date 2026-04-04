import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo reporte' })
  create(@Body() createReporteDto: CreateReporteDto) {
    return this.reportesService.create(createReporteDto);
  }

  @Post('generar')
  @ApiOperation({ summary: 'Generar reporte dinámico desde dashboard' })
  async generarDinamico(@Body() data: {
    tipo: 'academico' | 'financiero' | 'usuarios' | 'cursos';
    titulo: string;
    fechaInicio?: string;
    fechaFin?: string;
    descripcion?: string;
    exportar?: boolean;
  }) {
    return await this.reportesService.generarReporteDinamico(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los reportes' })
  findAll(@Query('tipo') tipo?: string) {
    return this.reportesService.findAll(tipo);
  }

  @Get('tipos')
  @ApiOperation({ summary: 'Obtener tipos de reportes disponibles' })
  getTipos() {
    return this.reportesService.getTipos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un reporte por ID' })
  findOne(@Param('id') id: string) {
    return this.reportesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un reporte' })
  update(@Param('id') id: string, @Body() updateReporteDto: UpdateReporteDto) {
    return this.reportesService.update(id, updateReporteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un reporte' })
  remove(@Param('id') id: string) {
    return this.reportesService.remove(id);
  }

  @Post(':id/generar')
  @ApiOperation({ summary: 'Generar el reporte' })
  generar(@Param('id') id: string) {
    return this.reportesService.generar(id);
  }
}
