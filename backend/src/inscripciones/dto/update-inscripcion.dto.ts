import { IsIn } from 'class-validator';

export class UpdateInscripcionDto {
  @IsIn(['Pendiente', 'Aceptada', 'Rechazada'])
  estado: string;
}