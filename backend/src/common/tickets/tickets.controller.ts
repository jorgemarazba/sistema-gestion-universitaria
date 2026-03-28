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
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Body() dto: any): Promise<Ticket> {
    return await this.ticketsService.create(dto);
  }

  @Get()
  async findAll(): Promise<Ticket[]> {
    return await this.ticketsService.findAll();
  }

  @Get('recientes')
  async findRecientes(@Query('limite') limite: string): Promise<Ticket[]> {
    return await this.ticketsService.findRecientes(parseInt(limite) || 5);
  }

  @Get('estadisticas')
  async getEstadisticas(): Promise<{ [key: string]: number }> {
    return await this.ticketsService.contarPorEstado();
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(@Param('usuarioId') usuarioId: string): Promise<Ticket[]> {
    return await this.ticketsService.findByUsuario(usuarioId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ticket> {
    return await this.ticketsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any): Promise<Ticket> {
    return await this.ticketsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.ticketsService.remove(id);
  }
}
