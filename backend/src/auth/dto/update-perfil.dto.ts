import { PartialType, PickType } from '@nestjs/swagger';
import { RegistroDto } from './registro.dto';

export class UpdatePerfilDto extends PartialType(
  PickType(RegistroDto, ['nombre', 'alias'] as const),
) {}