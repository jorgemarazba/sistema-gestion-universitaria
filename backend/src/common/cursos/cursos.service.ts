import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso, NivelCurso, EstadoCurso, ModalidadCurso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    try {
      console.log('DTO recibido:', createCursoDto);
      // Sanitizar campos UUID vacíos
      const sanitizedDto = {
        ...createCursoDto,
        profesorId: createCursoDto.profesorId?.trim() || undefined,
        programaId: createCursoDto.programaId?.trim() || undefined,
      };
      const curso = this.cursoRepo.create({
        ...sanitizedDto,
        estado: EstadoCurso.ACTIVO,
      });
      console.log('Entidad creada:', curso);
      return await this.cursoRepo.save(curso);
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  }

  async findAll(
    carrera?: string,
    programaId?: string,
    modalidad?: ModalidadCurso,
  ): Promise<Curso[]> {
    const where: any = {};
    
    if (carrera) {
      where.carrera = carrera;
    }
    if (programaId) {
      where.programaId = programaId;
    }
    if (modalidad) {
      where.modalidad = modalidad;
    }
    
    return await this.cursoRepo.find({ where });
  }

  async findOne(id: string): Promise<Curso> {
    const curso = await this.cursoRepo.findOne({ where: { id } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  async update(id: string, updateCursoDto: UpdateCursoDto): Promise<Curso> {
    const curso = await this.findOne(id);
    Object.assign(curso, updateCursoDto);
    return await this.cursoRepo.save(curso);
  }

  async remove(id: string): Promise<void> {
    const curso = await this.findOne(id);
    await this.cursoRepo.remove(curso);
  }

  async getCarreras(): Promise<string[]> {
    const carreras = await this.cursoRepo
      .createQueryBuilder('curso')
      .select('DISTINCT curso.carrera', 'carrera')
      .getRawMany();
    return carreras.map(c => c.carrera);
  }

  async getModalidades(): Promise<string[]> {
    return Object.values(ModalidadCurso);
  }
}
