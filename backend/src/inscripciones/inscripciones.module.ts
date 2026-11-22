import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { TorneosModule } from '../torneos/torneos.module';
import { EquiposModule } from '../equipos/equipos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion]), TorneosModule, EquiposModule],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
})
export class InscripcionesModule {}