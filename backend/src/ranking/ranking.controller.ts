import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RankingService } from './ranking.service';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get(':torneoId')
  @ApiOperation({
    summary: 'Obtener ranking de un torneo',
    description:
      'Calcula la clasificación de los equipos aceptados según sus resultados oficiales.',
  })
  obtenerRanking(@Param('torneoId', ParseIntPipe) torneoId: number) {
    return this.rankingService.obtenerRanking(torneoId);
  }
}
