import { IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';

export const MODALIDADES = ['Liga', 'Eliminación directa'];
export const ESTADOS_TORNEO = ['Abierto', 'En curso', 'Finalizado'];

export class CreateTorneoDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  videojuego: string;

  @IsIn(MODALIDADES)
  modalidad: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  cierreInscripcion: string;

  @IsInt()
  @Min(2)
  cupoMaximo: number;

  @IsOptional()
  @IsIn(ESTADOS_TORNEO)
  estado?: string;
}