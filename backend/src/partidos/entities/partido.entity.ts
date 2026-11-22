import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Torneo } from '../../torneos/entities/torneo.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Resultado } from '../../resultados/entities/resultado.entity';

@Entity('partidos')
export class Partido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  torneoId: number;

  @ManyToOne(() => Torneo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'torneoId' })
  torneo: Torneo;

  @Column('int')
  equipoLocalId: number;

  @ManyToOne(() => Equipo)
  @JoinColumn({ name: 'equipoLocalId' })
  equipoLocal: Equipo;

  @Column('int')
  equipoVisitanteId: number;

  @ManyToOne(() => Equipo)
  @JoinColumn({ name: 'equipoVisitanteId' })
  equipoVisitante: Equipo;

  @Column({ type: 'datetime' })
  fechaHora: Date;

  @Column({ length: 100 })
  ronda: string;

  @Column({ length: 20, default: 'Programado' })
  estado: string;

  @OneToOne(() => Resultado, (resultado) => resultado.partido)
  resultado: Resultado;
}
