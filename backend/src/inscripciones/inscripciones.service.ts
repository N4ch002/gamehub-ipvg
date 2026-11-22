import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { TorneosService } from '../torneos/torneos.service';
import { EquiposService } from '../equipos/equipos.service';
import { UsuarioToken } from '../auth/usuario-token.interface';

export function fechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionesRepo: Repository<Inscripcion>,
    private readonly torneosService: TorneosService,
    private readonly equiposService: EquiposService,
  ) {}

  findAll(torneoId?: number) {
    return this.inscripcionesRepo.find({
      where: torneoId ? { torneoId } : {},
      relations: { torneo: true, equipo: true },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.inscripcionesRepo.findOne({
      where: { id },
      relations: { torneo: true, equipo: true },
    });
    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }
    return inscripcion;
  }

  async create(dto: CreateInscripcionDto, usuario: UsuarioToken) {
    const torneo = await this.torneosService.findOne(dto.torneoId);
    const equipo = await this.equiposService.findOne(dto.equipoId);

    if (usuario.rol !== 'admin' && equipo.capitanId !== usuario.sub) {
      throw new ForbiddenException('Solo el capitán del equipo puede inscribirlo');
    }
    if (torneo.estado !== 'Abierto' || fechaHoy() > torneo.cierreInscripcion) {
      throw new BadRequestException('El período de inscripción de este torneo está cerrado');
    }
    const duplicada = await this.inscripcionesRepo.findOneBy({
      torneoId: dto.torneoId,
      equipoId: dto.equipoId,
    });
    if (duplicada) {
      throw new ConflictException('El equipo ya está inscrito en este torneo');
    }
    await this.verificarCupo(dto.torneoId, torneo.cupoMaximo);

    const inscripcion = this.inscripcionesRepo.create({
      torneoId: dto.torneoId,
      equipoId: dto.equipoId,
      estado: 'Pendiente',
    });
    const guardada = await this.inscripcionesRepo.save(inscripcion);
    return this.findOne(guardada.id);
  }

  async update(id: number, dto: UpdateInscripcionDto) {
    const inscripcion = await this.findOne(id);
    if (inscripcion.estado === 'Rechazada' && dto.estado !== 'Rechazada') {
      await this.verificarCupo(inscripcion.torneoId, inscripcion.torneo.cupoMaximo);
    }
    await this.inscripcionesRepo.update(id, { estado: dto.estado });
    return this.findOne(id);
  }

  private async verificarCupo(torneoId: number, cupoMaximo: number) {
    const ocupados = await this.inscripcionesRepo.count({
      where: { torneoId, estado: Not('Rechazada') },
    });
    if (ocupados >= cupoMaximo) {
      throw new BadRequestException('El torneo alcanzó su cupo máximo de equipos');
    }
  }
}