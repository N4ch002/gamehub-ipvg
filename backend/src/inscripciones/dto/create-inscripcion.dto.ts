import { IsInt } from 'class-validator';

export class CreateInscripcionDto {
  @IsInt()
  torneoId: number;

  @IsInt()
  equipoId: number;
}