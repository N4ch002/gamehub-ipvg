import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { RankingService } from './ranking.service';

describe('RankingService', () => {
  let service: RankingService;

  const inscripcionesRepo = {
    find: jest.fn<(criterio: any) => Promise<any[]>>(),
  };

  const torneosRepo = {
    findOneBy: jest.fn<(criterio: any) => Promise<any>>(),
  };

  const partidosRepo = {
    find: jest.fn<(criterio: any) => Promise<any[]>>(),
  };

  const equipos = [
    { id: 1, nombre: 'Alfa' },
    { id: 2, nombre: 'Beta' },
    { id: 3, nombre: 'Gamma' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    service = new RankingService(
      inscripcionesRepo as any,
      torneosRepo as any,
      partidosRepo as any,
    );

    torneosRepo.findOneBy.mockResolvedValue({
      id: 1,
      nombre: 'Torneo de prueba',
      modalidad: 'Liga',
    });

    inscripcionesRepo.find.mockResolvedValue(
      equipos.map((equipo) => ({ equipo })),
    );

    partidosRepo.find.mockResolvedValue([]);
  });

  it('asigna 3 puntos al ganador y 0 al perdedor', async () => {
    partidosRepo.find.mockResolvedValue([
      {
        equipoLocalId: 1,
        equipoVisitanteId: 2,
        resultado: {
          marcadorLocal: 2,
          marcadorVisitante: 1,
        },
      },
    ]);

    const resultado = await service.obtenerRanking(1);

    expect(
      resultado.ranking.find((equipo) => equipo.equipoId === 1)?.puntos,
    ).toBe(3);

    expect(
      resultado.ranking.find((equipo) => equipo.equipoId === 2)?.puntos,
    ).toBe(0);
  });

  it('asigna 1 punto a cada equipo en un empate', async () => {
    partidosRepo.find.mockResolvedValue([
      {
        equipoLocalId: 1,
        equipoVisitanteId: 2,
        resultado: {
          marcadorLocal: 1,
          marcadorVisitante: 1,
        },
      },
    ]);

    const resultado = await service.obtenerRanking(1);

    expect(
      resultado.ranking.find((equipo) => equipo.equipoId === 1)?.puntos,
    ).toBe(1);

    expect(
      resultado.ranking.find((equipo) => equipo.equipoId === 2)?.puntos,
    ).toBe(1);
  });

  it('no considera partidos sin resultado', async () => {
    partidosRepo.find.mockResolvedValue([
      {
        equipoLocalId: 1,
        equipoVisitanteId: 2,
        resultado: null,
      },
    ]);

    const resultado = await service.obtenerRanking(1);

    expect(
      resultado.ranking.every((equipo) => equipo.jugados === 0),
    ).toBe(true);
  });

  it('ordena los equipos por puntos de mayor a menor', async () => {
    partidosRepo.find.mockResolvedValue([
      {
        equipoLocalId: 1,
        equipoVisitanteId: 2,
        resultado: {
          marcadorLocal: 2,
          marcadorVisitante: 0,
        },
      },
      {
        equipoLocalId: 3,
        equipoVisitanteId: 1,
        resultado: {
          marcadorLocal: 2,
          marcadorVisitante: 0,
        },
      },
      {
        equipoLocalId: 3,
        equipoVisitanteId: 2,
        resultado: {
          marcadorLocal: 2,
          marcadorVisitante: 0,
        },
      },
    ]);

    const resultado = await service.obtenerRanking(1);

    expect(resultado.ranking.map((equipo) => equipo.equipo)).toEqual([
      'Gamma',
      'Alfa',
      'Beta',
    ]);
  });

  it('lanza un error si el torneo no existe', async () => {
    torneosRepo.findOneBy.mockResolvedValue(null);

    await expect(service.obtenerRanking(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
