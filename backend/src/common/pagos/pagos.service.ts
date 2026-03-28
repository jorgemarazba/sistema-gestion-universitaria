import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago, EstadoPago } from './entities/pago.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

interface CreatePagoDto {
  concepto: string;
  monto: number;
  usuarioId: string;
  fechaVencimiento?: Date;
  metodoPago?: 'transferencia' | 'tarjeta' | 'efectivo' | 'paypal';
  referencia?: string;
  notas?: string;
}

interface UpdatePagoDto {
  estado?: EstadoPago;
  metodoPago?: 'transferencia' | 'tarjeta' | 'efectivo' | 'paypal';
  referencia?: string;
  notas?: string;
  fechaPago?: Date;
  comprobante?: string;
}

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagosRepo: Repository<Pago>,
    private notificacionesService: NotificacionesService,
  ) {}

  async create(dto: CreatePagoDto): Promise<Pago> {
    const pago = this.pagosRepo.create({
      ...dto,
      estado: 'pendiente',
    });

    const pagoGuardado = await this.pagosRepo.save(pago);

    // Crear notificación para admin
    await this.notificacionesService.notificarNuevoPago(
      dto.usuarioId,
      'Usuario', // Se podría obtener el nombre real
      dto.monto,
    );

    return pagoGuardado;
  }

  async findAll(): Promise<Pago[]> {
    return await this.pagosRepo.find({
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findPendientes(limite: number = 5): Promise<Pago[]> {
    return await this.pagosRepo.find({
      where: { estado: 'pendiente' },
      relations: ['usuario'],
      order: { fechaVencimiento: 'ASC' },
      take: limite,
    });
  }

  async findByUsuario(usuarioId: string): Promise<Pago[]> {
    return await this.pagosRepo.find({
      where: { usuarioId },
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Pago> {
    const pago = await this.pagosRepo.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }

    return pago;
  }

  async update(id: string, dto: UpdatePagoDto): Promise<Pago> {
    const pago = await this.findOne(id);

    if (dto.estado === 'procesado' && !pago.fechaPago) {
      dto.fechaPago = new Date();
    }

    Object.assign(pago, dto);
    return await this.pagosRepo.save(pago);
  }

  async procesarPago(id: string, metodoPago: string, referencia?: string): Promise<Pago> {
    return await this.update(id, {
      estado: 'procesado',
      metodoPago: metodoPago as any,
      referencia,
      fechaPago: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    const pago = await this.findOne(id);
    await this.pagosRepo.remove(pago);
  }

  async contarPorEstado(): Promise<{ [key: string]: number }> {
    const estados: EstadoPago[] = ['pendiente', 'procesado', 'vencido', 'cancelado'];
    const resultado: { [key: string]: number } = {};

    for (const estado of estados) {
      resultado[estado] = await this.pagosRepo.count({ where: { estado } });
    }

    return resultado;
  }

  async obtenerTotalPendiente(): Promise<number> {
    const pagos = await this.pagosRepo.find({
      where: { estado: 'pendiente' },
      select: ['monto'],
    });

    return pagos.reduce((total, pago) => total + Number(pago.monto), 0);
  }
}
