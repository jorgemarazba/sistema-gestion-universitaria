import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async registrarSolicitud(dto: CreateSolicitudDto) {
    const existe = await this.usuariosRepo.findOne({
      where: [
        { documentoIdentidad: dto.documento_identidad },
        { correoPersonal: dto.correo_personal },
      ],
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe una solicitud o usuario con estos datos.',
      );
    }

    const nuevaSolicitud = this.usuariosRepo.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      documentoIdentidad: dto.documento_identidad,
      correoPersonal: dto.correo_personal,
      rol: dto.tipo_usuario,
      motivoSolicitud: dto.motivo,
      estado: 'pendiente',
    });

    return await this.usuariosRepo.save(nuevaSolicitud);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub pendiente
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return this.usuariosRepo.find();
  }

  findOne(id: string) {
    return this.usuariosRepo.findOne({ where: { id_usuario: id } });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub pendiente
  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: string) {
    return `This action removes a #${id} usuario`;
  }
}
