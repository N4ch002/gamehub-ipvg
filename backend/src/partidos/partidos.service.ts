import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Partido } from './entities/partido.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { CrearPartidoDto } from './dto/crear-partido.dto';
import { TorneosService } from '../torneos/torneos.service';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido)
    private readonly partidosRepo: Repository<Partido>,

    @InjectRepository(Inscripcion)
    private readonly inscripcionesRepo: Repository<Inscripcion>,

    private readonly torneosService: TorneosService,
  ) {}

  findAll(torneoId?: number) {
    return this.partidosRepo.find({
      where: torneoId ? { torneoId } : {},
      relations: {
        torneo: true,
        equipoLocal: true,
        equipoVisitante: true,
        resultado: {
          ganador: true,
        },
      },
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: number) {
    const partido = await this.partidosRepo.findOne({
      where: { id },
      relations: {
        torneo: true,
        equipoLocal: true,
        equipoVisitante: true,
        resultado: {
          ganador: true,
        },
      },
    });

    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }

    return partido;
  }

  async create(dto: CrearPartidoDto) {
    await this.torneosService.findOne(dto.torneoId);

    if (dto.equipoLocalId === dto.equipoVisitanteId) {
      throw new BadRequestException(
        'Un equipo no puede enfrentarse a sí mismo',
      );
    }

    const inscripciones = await this.inscripcionesRepo.count({
      where: {
        torneoId: dto.torneoId,
        equipoId: In([dto.equipoLocalId, dto.equipoVisitanteId]),
        estado: 'Aceptada',
      },
    });

    if (inscripciones !== 2) {
      throw new BadRequestException(
        'Ambos equipos deben estar aceptados en el torneo',
      );
    }

    const partido = this.partidosRepo.create({
      ...dto,
      estado: 'Programado',
    });

    const guardado = await this.partidosRepo.save(partido);

    return this.findOne(guardado.id);
  }

  async remove(id: number) {
    const partido = await this.findOne(id);

    await this.partidosRepo.remove(partido);

    return {
      mensaje: 'Partido eliminado correctamente',
      id,
    };
  }

  async marcarFinalizado(id: number) {
    const partido = await this.findOne(id);

    partido.estado = 'Finalizado';

    await this.partidosRepo.save(partido);

    return this.findOne(id);
  }
}
