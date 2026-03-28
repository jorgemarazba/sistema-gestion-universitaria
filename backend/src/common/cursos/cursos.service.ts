import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso, NivelCurso, EstadoCurso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const curso = this.cursoRepo.create({
      ...createCursoDto,
      estado: EstadoCurso.ACTIVO,
    });
    return await this.cursoRepo.save(curso);
  }

  async findAll(carrera?: string): Promise<Curso[]> {
    if (carrera) {
      return await this.cursoRepo.find({ where: { carrera } });
    }
    return await this.cursoRepo.find();
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
}
