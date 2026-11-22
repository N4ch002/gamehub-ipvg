import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { UsuarioToken } from '../auth/usuario-token.interface';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepo: Repository<Equipo>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  findAll() {
    return this.equiposRepo.find({
      relations: { capitan: true, integrantes: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const equipo = await this.equiposRepo.findOne({
      where: { id },
      relations: { capitan: true, integrantes: true },
    });
    if (!equipo) {
      throw new NotFoundException('Equipo no encontrado');
    }
    return equipo;
  }

  async create(dto: CreateEquipoDto, usuario: UsuarioToken) {
    await this.verificarNombre(dto.nombre);
    const integrantes = await this.buscarIntegrantes(usuario.sub, dto.integrantesIds);
    const equipo = this.equiposRepo.create({
      nombre: dto.nombre,
      juegoPreferido: dto.juegoPreferido,
      estado: dto.estado ?? 'Activo',
      capitanId: usuario.sub,
      integrantes,
    });
    const guardado = await this.equiposRepo.save(equipo);
    return this.findOne(guardado.id);
  }

  async update(id: number, dto: UpdateEquipoDto, usuario: UsuarioToken) {
    const equipo = await this.findOne(id);
    this.verificarPermiso(equipo, usuario);
    if (dto.nombre && dto.nombre !== equipo.nombre) {
      await this.verificarNombre(dto.nombre);
    }
    const { integrantesIds, ...datos } = dto;
    Object.assign(equipo, datos);
    if (integrantesIds) {
      equipo.integrantes = await this.buscarIntegrantes(equipo.capitanId, integrantesIds);
    }
    await this.equiposRepo.save(equipo);
    return this.findOne(id);
  }

  async remove(id: number, usuario: UsuarioToken) {
    const equipo = await this.findOne(id);
    this.verificarPermiso(equipo, usuario);
    await this.equiposRepo.remove(equipo);
    return {
      mensaje: 'Equipo eliminado correctamente',
      id,
    };
  }

  private async verificarNombre(nombre: string) {
    const existe = await this.equiposRepo.findOneBy({ nombre });
    if (existe) {
      throw new ConflictException('Ya existe un equipo con ese nombre');
    }
  }

  private async buscarIntegrantes(capitanId: number, ids: number[] = []) {
    const todos = [...new Set([capitanId, ...ids])];
    const integrantes = await this.usuariosRepo.findBy({ id: In(todos) });
    if (integrantes.length !== todos.length) {
      throw new BadRequestException('Uno o más integrantes no existen');
    }
    return integrantes;
  }

  private verificarPermiso(equipo: Equipo, usuario: UsuarioToken) {
    if (usuario.rol !== 'admin' && equipo.capitanId !== usuario.sub) {
      throw new ForbiddenException('Solo el capitán o un administrador puede modificar este equipo');
    }
  }
}