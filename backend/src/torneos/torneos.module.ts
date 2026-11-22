import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from './entities/torneo.entity';
import { TorneosController } from './torneos.controller';
import { TorneosService } from './torneos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Torneo])],
  controllers: [TorneosController],
  providers: [TorneosService],
  exports: [TorneosService],
})
export class TorneosModule {}