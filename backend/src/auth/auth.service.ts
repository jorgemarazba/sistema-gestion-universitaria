import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../common/usuarios/entities/usuario.entity';
import { LoginDto } from '../common/dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const correoLimpio = loginDto.correo.trim().toLowerCase()
    const passLimpia = loginDto.contrasena.trim()

    const usuario = await this.usuariosRepo.findOne({
      where: { correoInstitucional: correoLimpio },
      select: [
        'id_usuario',
        'nombre',
        'correoInstitucional',
        'contrasena',
        'rol',
        'estado',
      ],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    if (!usuario.contrasena) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    const hashDeBD = (usuario.contrasena || '').trim()
    const isMatch = await bcrypt.compare(passLimpia, hashDeBD)

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    if (usuario.estado !== 'activo') {
      throw new UnauthorizedException(
        'Tu cuenta está pendiente de aprobación o inactiva.',
      )
    }

    const payload = {
      sub: usuario.id_usuario,
      email: usuario.correoInstitucional,
      rol: usuario.rol,
    };

    return {
      user: {
        nombre: usuario.nombre,
        rol: usuario.rol,
        email: usuario.correoInstitucional,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
