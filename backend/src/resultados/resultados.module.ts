import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Resultado } from './entities/resultado.entity';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';

import { PartidosModule } from '../partidos/partidos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resultado]),
    PartidosModule,
  ],
  controllers: [ResultadosController],
  providers: [ResultadosService],
  exports: [ResultadosService],
})
export class ResultadosModule {}
