import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte, TipoReporte, EstadoReporte } from './entities/reporte.entity';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepo: Repository<Reporte>,
  ) {}

  async create(createReporteDto: CreateReporteDto): Promise<Reporte> {
    const reporte = this.reporteRepo.create({
      ...createReporteDto,
      estado: EstadoReporte.PENDIENTE,
    });
    return await this.reporteRepo.save(reporte);
  }

  async findAll(tipo?: string): Promise<Reporte[]> {
    if (tipo) {
      return await this.reporteRepo.find({ where: { tipo: tipo as TipoReporte } });
    }
    return await this.reporteRepo.find();
  }

  async findOne(id: string): Promise<Reporte> {
    const reporte = await this.reporteRepo.findOne({ where: { id } });
    if (!reporte) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }
    return reporte;
  }

  async update(id: string, updateReporteDto: UpdateReporteDto): Promise<Reporte> {
    const reporte = await this.findOne(id);
    Object.assign(reporte, updateReporteDto);
    return await this.reporteRepo.save(reporte);
  }

  async remove(id: string): Promise<void> {
    const reporte = await this.findOne(id);
    await this.reporteRepo.remove(reporte);
  }

  getTipos() {
    return Object.values(TipoReporte);
  }

  async generar(id: string): Promise<Reporte> {
    const reporte = await this.findOne(id);
    reporte.estado = EstadoReporte.EN_PROCESO;
    await this.reporteRepo.save(reporte);

    // Aquí iría la lógica real de generación del reporte
    // Por ahora simulamos un reporte generado
    setTimeout(async () => {
      reporte.estado = EstadoReporte.COMPLETADO;
      reporte.resultado = `Reporte ${reporte.tipo} generado exitosamente`;
      await this.reporteRepo.save(reporte);
    }, 2000);

    return reporte;
  }
}
