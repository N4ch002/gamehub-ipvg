import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(dto: RegistroDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    return this.usuariosService.create({
      ...dto,
      password: hash,
      rol: 'estudiante',
    });
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.findByCorreoConPassword(dto.correo);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    const valida = await bcrypt.compare(dto.password, usuario.password);
    if (!valida) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    const payload = { sub: usuario.id, correo: usuario.correo, rol: usuario.rol };
    const { password, ...datosUsuario } = usuario;
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: datosUsuario,
    };
  }

  perfil(id: number) {
    return this.usuariosService.findOne(id);
  }

  actualizarPerfil(id: number, dto: UpdatePerfilDto) {
    return this.usuariosService.update(id, dto);
  }
}