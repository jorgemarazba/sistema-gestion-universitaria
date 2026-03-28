import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@ApiTags('Cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo curso' })
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los cursos' })
  findAll(@Query('carrera') carrera?: string) {
    return this.cursosService.findAll(carrera);
  }

  @Get('carreras')
  @ApiOperation({ summary: 'Obtener lista de carreras disponibles' })
  getCarreras() {
    return this.cursosService.getCarreras();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un curso por ID' })
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un curso' })
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un curso' })
  remove(@Param('id') id: string) {
    return this.cursosService.remove(id);
  }
}
