import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Partido } from '../partidos/entities/partido.entity';

import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Torneo, Partido])],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
