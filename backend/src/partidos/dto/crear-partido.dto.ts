import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CrearPartidoDto {
  @IsInt()
  torneoId: number;

  @IsInt()
  equipoLocalId: number;

  @IsInt()
  equipoVisitanteId: number;

  @IsDateString()
  fechaHora: string;

  @IsString()
  @IsNotEmpty()
  ronda: string;
}
