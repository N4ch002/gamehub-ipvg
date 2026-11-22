import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Equipo } from '../equipos/entities/equipo.entity';
import { Resultado } from './entities/resultado.entity';
import { CrearResultadoDto } from './dto/crear-resultado.dto';
import { ActualizarResultadoDto } from './dto/actualizar-resultado.dto';
import { PartidosService } from '../partidos/partidos.service';
import { UsuarioToken } from '../auth/usuario-token.interface';

@Injectable()
export class ResultadosService {
  constructor(
    @InjectRepository(Resultado)
    private readonly resultadosRepo: Repository<Resultado>,
    private readonly partidosService: PartidosService,
  ) {}

  findAll() {
    return this.resultadosRepo.find({
      relations: {
        partido: {
          torneo: true,
          equipoLocal: true,
          equipoVisitante: true,
        },
        ganador: true,
        registradoPor: true,
      },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const resultado = await this.resultadosRepo.findOne({
      where: { id },
      relations: {
        partido: {
          torneo: true,
          equipoLocal: true,
          equipoVisitante: true,
        },
        ganador: true,
        registradoPor: true,
      },
    });

    if (!resultado) {
      throw new NotFoundException('Resultado no encontrado');
    }

    return resultado;
  }

  async create(dto: CrearResultadoDto, usuario: UsuarioToken) {
    const partido = await this.partidosService.findOne(dto.partidoId);

    const existente = await this.resultadosRepo.findOneBy({
      partidoId: dto.partidoId,
    });

    if (existente) {
      throw new ConflictException(
        'Este partido ya tiene un resultado registrado',
      );
    }

    this.validarEmpate(
      partido.torneo.modalidad,
      dto.marcadorLocal,
      dto.marcadorVisitante,
    );

    const ganadorId =
      dto.marcadorLocal > dto.marcadorVisitante
        ? partido.equipoLocalId
        : dto.marcadorVisitante > dto.marcadorLocal
          ? partido.equipoVisitanteId
          : null;

    const resultado = this.resultadosRepo.create({
      partidoId: dto.partidoId,
      marcadorLocal: dto.marcadorLocal,
      marcadorVisitante: dto.marcadorVisitante,
      ganadorId,
      registradoPorId: usuario.sub,
    });

    const guardado = await this.resultadosRepo.save(resultado);

    await this.partidosService.marcarFinalizado(partido.id);

    return this.findOne(guardado.id);
  }

  async update(id: number, dto: ActualizarResultadoDto) {
    const resultado = await this.findOne(id);
    const partido = resultado.partido;

    const marcadorLocal = dto.marcadorLocal ?? resultado.marcadorLocal;
    const marcadorVisitante =
      dto.marcadorVisitante ?? resultado.marcadorVisitante;

    this.validarEmpate(
      partido.torneo.modalidad,
      marcadorLocal,
      marcadorVisitante,
    );

    resultado.marcadorLocal = marcadorLocal;
    resultado.marcadorVisitante = marcadorVisitante;

    const ganadorId =
      marcadorLocal > marcadorVisitante
    ? partido.equipoLocalId
    : marcadorVisitante > marcadorLocal
      ? partido.equipoVisitanteId
      : null;

    resultado.ganadorId = ganadorId;
    resultado.ganador = ganadorId
    ? ({ id: ganadorId } as Equipo)
    : null;

    await this.resultadosRepo.save(resultado);

    return this.findOne(id);
  }

  private validarEmpate(
    modalidad: string,
    marcadorLocal: number,
    marcadorVisitante: number,
  ) {
    if (
      modalidad === 'Eliminación directa' &&
      marcadorLocal === marcadorVisitante
    ) {
      throw new BadRequestException(
        'No se permiten empates en torneos de eliminación directa',
      );
    }
  }
}
