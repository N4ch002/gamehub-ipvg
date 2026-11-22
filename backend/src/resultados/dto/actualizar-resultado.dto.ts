import { OmitType, PartialType } from '@nestjs/swagger';
import { CrearResultadoDto } from './crear-resultado.dto';

export class ActualizarResultadoDto extends PartialType(
  OmitType(CrearResultadoDto, ['partidoId'] as const),
) {}
