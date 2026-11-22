import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partido } from './entities/partido.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';

import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';

import { TorneosModule } from '../torneos/torneos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partido, Inscripcion]),
    TorneosModule,
  ],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService],
})
export class PartidosModule {}
