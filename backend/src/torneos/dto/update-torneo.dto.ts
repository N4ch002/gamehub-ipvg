import { PartialType } from '@nestjs/swagger';
import { CreateTorneoDto } from './create-torneo.dto';

export class UpdateTorneoDto extends PartialType(CreateTorneoDto) {}