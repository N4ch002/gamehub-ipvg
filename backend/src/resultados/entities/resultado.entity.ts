import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { jest } from '@jest/globals';
import { Partido } from '../../partidos/entities/partido.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('resultados')
export class Resultado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { unique: true })
  partidoId: number;

  @OneToOne(() => Partido, (partido) => partido.resultado, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partidoId' })
  partido: Relation<Partido>;

  @Column('int')
  marcadorLocal: number;

  @Column('int')
  marcadorVisitante: number;

  @Column('int', { nullable: true })
  ganadorId: number | null;

  @ManyToOne(() => Equipo, { nullable: true })
  @JoinColumn({ name: 'ganadorId' })
  ganador: Equipo | null;

  @Column('int')
  registradoPorId: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registradoPorId' })
  registradoPor: Usuario;
}
