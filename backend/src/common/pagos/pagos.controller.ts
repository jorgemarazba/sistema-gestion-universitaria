import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { Pago } from './entities/pago.entity';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  async create(@Body() dto: any): Promise<Pago> {
    return await this.pagosService.create(dto);
  }

  @Get()
  async findAll(): Promise<Pago[]> {
    return await this.pagosService.findAll();
  }

  @Get('pendientes')
  async findPendientes(@Query('limite') limite: string): Promise<Pago[]> {
    return await this.pagosService.findPendientes(parseInt(limite) || 5);
  }

  @Get('estadisticas')
  async getEstadisticas(): Promise<{ [key: string]: number }> {
    return await this.pagosService.contarPorEstado();
  }

  @Get('total-pendiente')
  async getTotalPendiente(): Promise<{ total: number }> {
    const total = await this.pagosService.obtenerTotalPendiente();
    return { total };
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(@Param('usuarioId') usuarioId: string): Promise<Pago[]> {
    return await this.pagosService.findByUsuario(usuarioId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pago> {
    return await this.pagosService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any): Promise<Pago> {
    return await this.pagosService.update(id, dto);
  }

  @Post(':id/procesar')
  async procesar(
    @Param('id') id: string,
    @Body('metodoPago') metodoPago: string,
    @Body('referencia') referencia?: string,
  ): Promise<Pago> {
    return await this.pagosService.procesarPago(id, metodoPago, referencia);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.pagosService.remove(id);
  }
}
