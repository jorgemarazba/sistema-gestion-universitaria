import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programa, EstadoPrograma } from './entities/programa.entity';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private readonly programaRepo: Repository<Programa>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto): Promise<Programa> {
    const programa = this.programaRepo.create({
      ...createProgramaDto,
      estado: createProgramaDto.estado || EstadoPrograma.ACTIVO,
    });
    return await this.programaRepo.save(programa);
  }

  async findAll(estado?: string): Promise<Programa[]> {
    try {
      console.log('ProgramasService.findAll llamado, estado:', estado);
      if (estado) {
        return await this.programaRepo.find({ where: { estado: estado as EstadoPrograma } });
      }
      return await this.programaRepo.find();
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Programa> {
    const programa = await this.programaRepo.findOne({ where: { id } });
    if (!programa) {
      throw new NotFoundException(`Programa con ID ${id} no encontrado`);
    }
    return programa;
  }

  async update(id: string, updateProgramaDto: UpdateProgramaDto): Promise<Programa> {
    const programa = await this.findOne(id);
    Object.assign(programa, updateProgramaDto);
    return await this.programaRepo.save(programa);
  }

  async remove(id: string): Promise<void> {
    const programa = await this.findOne(id);
    await this.programaRepo.remove(programa);
  }
}
