import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEquipoDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  juegoPreferido: string;

  @IsOptional()
  @IsIn(['Activo', 'Inactivo'])
  estado?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  integrantesIds?: number[];
}