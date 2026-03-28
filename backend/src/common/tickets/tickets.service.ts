import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, EstadoTicket } from './entities/ticket.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

interface CreateTicketDto {
  asunto: string;
  descripcion: string;
  categoria?: string;
  prioridad?: 'baja' | 'media' | 'alta' | 'critica';
  usuarioId: string;
}

interface UpdateTicketDto {
  estado?: EstadoTicket;
  respuesta?: string;
  asignadoA?: string;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepo: Repository<Ticket>,
    private notificacionesService: NotificacionesService,
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketsRepo.create({
      ...dto,
      estado: 'abierto',
    });

    const ticketGuardado = await this.ticketsRepo.save(ticket);

    // Crear notificación para admin
    await this.notificacionesService.notificarNuevoTicket(
      dto.usuarioId,
      'Usuario', // Se podría obtener el nombre real
      dto.asunto,
    );

    return ticketGuardado;
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketsRepo.find({
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findRecientes(limite: number = 5): Promise<Ticket[]> {
    return await this.ticketsRepo.find({
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
      take: limite,
    });
  }

  async findByUsuario(usuarioId: string): Promise<Ticket[]> {
    return await this.ticketsRepo.find({
      where: { usuarioId },
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepo.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (dto.estado === 'resuelto') {
      ticket.resueltoEn = new Date();
    }

    Object.assign(ticket, dto);
    return await this.ticketsRepo.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketsRepo.remove(ticket);
  }

  async contarPorEstado(): Promise<{ [key: string]: number }> {
    const estados: EstadoTicket[] = ['abierto', 'en_proceso', 'escalado', 'resuelto', 'cerrado'];
    const resultado: { [key: string]: number } = {};

    for (const estado of estados) {
      resultado[estado] = await this.ticketsRepo.count({ where: { estado } });
    }

    return resultado;
  }
}
