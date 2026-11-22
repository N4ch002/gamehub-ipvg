import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegistroDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  alias: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  password: string;
}