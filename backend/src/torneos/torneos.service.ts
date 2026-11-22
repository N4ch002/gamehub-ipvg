import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Torneo } from './entities/torneo.entity';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@Injectable()
export class TorneosService {
  constructor(
    @InjectRepository(Torneo)
    private readonly torneosRepo: Repository<Torneo>,
  ) {}

  findAll() {
    return this.torneosRepo.find({
      order: { fechaInicio: 'DESC' },
    });
  }

  async findOne(id: number) {
    const torneo = await this.torneosRepo.findOneBy({ id });
    if (!torneo) {
      throw new NotFoundException('Torneo no encontrado');
    }
    return torneo;
  }

  async create(dto: CreateTorneoDto) {
    this.validarFechas(dto.cierreInscripcion, dto.fechaInicio);
    const torneo = this.torneosRepo.create(dto);
    return this.torneosRepo.save(torneo);
  }

  async update(id: number, dto: UpdateTorneoDto) {
    const torneo = await this.findOne(id);
    Object.assign(torneo, dto);
    this.validarFechas(torneo.cierreInscripcion, torneo.fechaInicio);
    return this.torneosRepo.save(torneo);
  }

  async remove(id: number) {
    const torneo = await this.findOne(id);
    await this.torneosRepo.remove(torneo);
    return {
      mensaje: 'Torneo eliminado correctamente',
      id,
    };
  }

  private validarFechas(cierre: string, inicio: string) {
    if (new Date(cierre) > new Date(inicio)) {
      throw new BadRequestException(
        'El cierre de inscripción no puede ser posterior a la fecha de inicio',
      );
    }
  }
}