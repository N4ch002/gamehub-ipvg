import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { jest } from '@jest/globals';
import { InscripcionesService } from './inscripciones.service';

describe('InscripcionesService', () => {
  let service: InscripcionesService;

  const repo = {
    findOneBy: jest.fn<(criterio: any) => Promise<any>>(),
    findOne: jest.fn<(criterio: any) => Promise<any>>(),
    count: jest.fn<(criterio: any) => Promise<number>>(),
    create: jest.fn<(datos: any) => any>(),
    save: jest.fn<(datos: any) => Promise<any>>(),
  };

  const torneosService = {
    findOne: jest.fn<(id: number) => Promise<any>>(),
  };

  const equiposService = {
    findOne: jest.fn<(id: number) => Promise<any>>(),
  };

  const admin = {
    sub: 1,
    correo: 'admin@ipvg.cl',
    rol: 'admin',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new InscripcionesService(
      repo as any,
      torneosService as any,
      equiposService as any,
    );

    torneosService.findOne.mockResolvedValue({
      id: 1,
      estado: 'Abierto',
      cierreInscripcion: '2099-12-31',
      cupoMaximo: 2,
    });

    equiposService.findOne.mockResolvedValue({
      id: 5,
      capitanId: 1,
    });
  });

  it('rechaza una inscripción duplicada', async () => {
    repo.findOneBy.mockResolvedValue({ id: 10 });

    await expect(
      service.create({ torneoId: 1, equipoId: 5 }, admin),
    ).rejects.toThrow(ConflictException);
  });

  it('rechaza la inscripción cuando el cupo está completo', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.count.mockResolvedValue(2);

    await expect(
      service.create({ torneoId: 1, equipoId: 5 }, admin),
    ).rejects.toThrow(BadRequestException);
  });

  it('rechaza la inscripción si el período está cerrado', async () => {
    torneosService.findOne.mockResolvedValue({
      id: 1,
      estado: 'Cerrado',
      cierreInscripcion: '2099-12-31',
      cupoMaximo: 2,
    });

    await expect(
      service.create({ torneoId: 1, equipoId: 5 }, admin),
    ).rejects.toThrow(BadRequestException);
  });

  it('crea la inscripción en estado Pendiente cuando cumple las reglas', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.count.mockResolvedValue(0);
    repo.create.mockReturnValue({});
    repo.save.mockResolvedValue({ id: 1 });
    repo.findOne.mockResolvedValue({
      id: 1,
      estado: 'Pendiente',
      torneo: { id: 1, cupoMaximo: 2 },
      equipo: { id: 5 },
    });

    const resultado = await service.create(
      { torneoId: 1, equipoId: 5 },
      admin,
    );

    expect(resultado.estado).toBe('Pendiente');
  });

  it('rechaza la inscripción si el usuario no es capitán ni administrador', async () => {
    const usuario = {
      sub: 2,
      correo: 'usuario@ipvg.cl',
      rol: 'usuario',
    };

    await expect(
      service.create({ torneoId: 1, equipoId: 5 }, usuario),
    ).rejects.toThrow(ForbiddenException);
  });
});
