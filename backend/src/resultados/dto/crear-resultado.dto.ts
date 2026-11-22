import {
  IsInt,
  Min,
} from 'class-validator';

export class CrearResultadoDto {
  @IsInt()
  partidoId: number;

  @IsInt()
  @Min(0)
  marcadorLocal: number;

  @IsInt()
  @Min(0)
  marcadorVisitante: number;
}
