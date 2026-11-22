import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Partido } from '../partidos/entities/partido.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionesRepo: Repository<Inscripcion>,

    @InjectRepository(Torneo)
    private readonly torneosRepo: Repository<Torneo>,

    @InjectRepository(Partido)
    private readonly partidosRepo: Repository<Partido>,
  ) {}

  async obtenerRanking(torneoId: number) {
    const torneo = await this.torneosRepo.findOneBy({ id: torneoId });

    if (!torneo) {
      throw new NotFoundException('Torneo no encontrado');
    }

    const inscripciones = await this.inscripcionesRepo.find({
      where: { torneoId, estado: 'Aceptada' },
      relations: {
      equipo: true,
        },
    });

    const partidos = await this.partidosRepo.find({
      where: { torneoId },
      relations: {
      resultado: true,
      },
    });

    const ranking = inscripciones.map(({ equipo }) => {
      const estadisticas = {
        equipoId: equipo.id,
        equipo: equipo.nombre,
        jugados: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0,
        puntos: 0,
        golesFavor: 0,
        golesContra: 0,
        diferenciaGoles: 0,
      };

      for (const partido of partidos) {
        if (!partido.resultado) {
          continue;
        }

        const esLocal = partido.equipoLocalId === equipo.id;
        const esVisitante = partido.equipoVisitanteId === equipo.id;

        if (!esLocal && !esVisitante) {
          continue;
        }

        const resultado = partido.resultado;
        const favor = esLocal
          ? resultado.marcadorLocal
          : resultado.marcadorVisitante;
        const contra = esLocal
          ? resultado.marcadorVisitante
          : resultado.marcadorLocal;

        estadisticas.jugados++;
        estadisticas.golesFavor += favor;
        estadisticas.golesContra += contra;

        if (favor > contra) {
          estadisticas.ganados++;
          estadisticas.puntos += 3;
        } else if (favor === contra) {
          estadisticas.empatados++;
          estadisticas.puntos += 1;
        } else {
          estadisticas.perdidos++;
        }
      }

      estadisticas.diferenciaGoles =
        estadisticas.golesFavor - estadisticas.golesContra;

      return estadisticas;
    });

    ranking.sort(
      (a, b) =>
        b.puntos - a.puntos ||
        b.ganados - a.ganados ||
        a.equipo.localeCompare(b.equipo),
    );

    return {
      torneo: {
        id: torneo.id,
        nombre: torneo.nombre,
        modalidad: torneo.modalidad,
      },
      ranking,
    };
  }
}
