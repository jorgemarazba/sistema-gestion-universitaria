import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@ApiTags('Programas')
@Controller('programas')
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo programa académico' })
  create(@Body() createProgramaDto: CreateProgramaDto) {
    return this.programasService.create(createProgramaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los programas académicos' })
  findAll(@Query('estado') estado?: string) {
    return this.programasService.findAll(estado);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Comparar múltiples programas' })
  async compare(@Query('ids') ids: string) {
    const programaIds = ids.split(',').slice(0, 3);
    return this.programasService.compare(programaIds);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un programa por ID' })
  findOne(@Param('id') id: string) {
    return this.programasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un programa académico' })
  update(@Param('id') id: string, @Body() updateProgramaDto: UpdateProgramaDto) {
    return this.programasService.update(id, updateProgramaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un programa académico' })
  remove(@Param('id') id: string) {
    return this.programasService.remove(id);
  }
}
