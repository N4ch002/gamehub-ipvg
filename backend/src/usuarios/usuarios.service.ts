import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  findAll() {
    return this.usuariosRepo.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  findByCorreoConPassword(correo: string) {
    return this.usuariosRepo.findOne({
      where: { correo },
      select: {
        id: true,
        nombre: true,
        alias: true,
        correo: true,
        password: true,
        rol: true,
        activo: true,
      },
    });
  }

  async create(datos: {
    nombre: string;
    alias: string;
    correo: string;
    password: string;
    rol: string;
  }) {
    const existe = await this.usuariosRepo.findOne({
      where: [{ correo: datos.correo }, { alias: datos.alias }],
    });
    if (existe) {
      throw new ConflictException('El correo o alias ya está registrado');
    }
    const usuario = this.usuariosRepo.create(datos);
    const guardado = await this.usuariosRepo.save(usuario);
    return this.findOne(guardado.id);
  }

  async update(id: number, datos: Partial<Usuario>) {
    const usuario = await this.findOne(id);
    if (datos.alias && datos.alias !== usuario.alias) {
      const ocupado = await this.usuariosRepo.findOneBy({ alias: datos.alias });
      if (ocupado) {
        throw new ConflictException('El alias ya está en uso');
      }
    }
    Object.assign(usuario, datos);
    await this.usuariosRepo.save(usuario);
    return this.findOne(id);
  }
}