import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reporte, TipoReporte, EstadoReporte } from './entities/reporte.entity';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Pago } from '../pagos/entities/pago.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepo: Repository<Reporte>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(Curso)
    private readonly cursosRepo: Repository<Curso>,
    @InjectRepository(Pago)
    private readonly pagosRepo: Repository<Pago>,
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

  async generarReporteDinamico(data: {
    tipo: 'academico' | 'financiero' | 'usuarios' | 'cursos';
    titulo: string;
    fechaInicio?: string;
    fechaFin?: string;
    descripcion?: string;
    exportar?: boolean;
  }) {
    try {
      console.log('[ReportesService] Iniciando generación de reporte:', data);
      const { tipo, titulo, fechaInicio, fechaFin } = data;
      
      let reporteData: any = {};
      let resumen = '';

      switch (tipo) {
        case 'usuarios':
          console.log('[ReportesService] Generando datos de usuarios...');
          reporteData = await this.generarDatosUsuarios(fechaInicio, fechaFin);
          resumen = `Reporte de usuarios: ${reporteData.totalUsuarios} usuarios`;
          break;
        
        case 'cursos':
          console.log('[ReportesService] Generando datos de cursos...');
          reporteData = await this.generarDatosCursos(fechaInicio, fechaFin);
          resumen = `Reporte de cursos: ${reporteData.totalCursos} cursos`;
          break;
        
        case 'financiero':
          console.log('[ReportesService] Generando datos financieros...');
          reporteData = await this.generarDatosFinancieros(fechaInicio, fechaFin);
          resumen = `Reporte financiero: $${reporteData.totalIngresos?.toLocaleString() || 0} en ingresos`;
          break;
        
        case 'academico':
          console.log('[ReportesService] Generando datos académicos...');
          reporteData = await this.generarDatosAcademicos(fechaInicio, fechaFin);
          resumen = `Reporte académico: ${reporteData.totalEstudiantes} estudiantes, ${reporteData.totalCursos} cursos`;
          break;
        
        default:
          throw new Error('Tipo de reporte no válido');
      }

      console.log('[ReportesService] Datos generados, guardando en BD...');
      
      // Guardar el reporte en la base de datos
      const reporte = this.reporteRepo.create({
        titulo,
        tipo: tipo as TipoReporte,
        estado: EstadoReporte.COMPLETADO,
        filtros: { fechaInicio, fechaFin, descripcion: data.descripcion },
        resultado: resumen,
        creadoPor: 'sistema',
      });
      await this.reporteRepo.save(reporte);

      console.log('[ReportesService] Reporte guardado exitosamente:', reporte.id);

      return {
        success: true,
        reporteId: reporte.id,
        titulo,
        tipo,
        fechaGeneracion: new Date(),
        resumen,
        data: reporteData,
      };
    } catch (error) {
      console.error('[ReportesService] ERROR al generar reporte:', error);
      throw error;
    }
  }

  private async generarDatosUsuarios(fechaInicio?: string, fechaFin?: string) {
    const where: any = {};
    
    if (fechaInicio && fechaFin) {
      where.fechaRegistro = Between(new Date(fechaInicio), new Date(fechaFin));
    }

    const [usuarios, total] = await this.usuariosRepo.findAndCount({
      where,
      order: { fechaRegistro: 'DESC' },
    });

    const porRol = usuarios.reduce((acc, u) => {
      acc[u.rol] = (acc[u.rol] || 0) + 1;
      return acc;
    }, {});

    return {
      totalUsuarios: total,
      porRol,
      usuarios: usuarios.map(u => ({
        id: u.id_usuario,
        nombre: `${u.nombre} ${u.apellido}`,
        correo: u.correoInstitucional || u.correoPersonal,
        rol: u.rol,
        estado: u.estado,
        fechaRegistro: u.fechaRegistro,
      })),
    };
  }

  private async generarDatosCursos(fechaInicio?: string, fechaFin?: string) {
    const where: any = {};
    
    if (fechaInicio && fechaFin) {
      where.creadoEn = Between(new Date(fechaInicio), new Date(fechaFin));
    }

    const [cursos, total] = await this.cursosRepo.findAndCount({
      where,
      order: { creadoEn: 'DESC' },
    });

    return {
      totalCursos: total,
      cursos: cursos.map(c => ({
        id: c.id,
        codigo: c.codigo,
        nombre: c.nombre,
        carrera: c.carrera,
        creditos: c.creditos,
        cupos: c.cupos,
        inscritos: 0,
        profesorId: c.profesorId || 'Sin asignar',
        estado: c.estado,
      })),
    };
  }

  private async generarDatosFinancieros(fechaInicio?: string, fechaFin?: string) {
    const where: any = {};
    
    if (fechaInicio && fechaFin) {
      where.creadoEn = Between(new Date(fechaInicio), new Date(fechaFin));
    }

    const pagos = await this.pagosRepo.find({
      where,
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
    });

    const totalIngresos = pagos
      .filter(p => p.estado === 'procesado')
      .reduce((sum, p) => sum + Number(p.monto), 0);

    const porEstado = pagos.reduce((acc, p) => {
      acc[p.estado] = (acc[p.estado] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPagos: pagos.length,
      totalIngresos,
      porEstado,
      pagos: pagos.map(p => ({
        id: p.id,
        concepto: p.concepto,
        monto: p.monto,
        estado: p.estado,
        usuario: p.usuario ? `${p.usuario.nombre} ${p.usuario.apellido}` : 'N/A',
        fecha: p.creadoEn,
      })),
    };
  }

  private async generarDatosAcademicos(fechaInicio?: string, fechaFin?: string) {
    const [usuarios, cursos] = await Promise.all([
      this.usuariosRepo.find({ where: { rol: 'estudiante' } }),
      this.cursosRepo.find(),
    ]);

    return {
      totalEstudiantes: usuarios.length,
      totalCursos: cursos.length,
      cursosActivos: cursos.filter(c => c.estado === 'activo').length,
      promedioCupos: Math.round(cursos.reduce((sum, c) => sum + (c.cupos || 0), 0) / cursos.length) || 0,
    };
  }
}
