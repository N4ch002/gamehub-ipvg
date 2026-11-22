import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Torneo } from '../../torneos/entities/torneo.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';

@Entity('inscripciones')
@Unique(['torneoId', 'equipoId'])
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  torneoId: number;

  @ManyToOne(() => Torneo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'torneoId' })
  torneo: Torneo;

  @Column('int')
  equipoId: number;

  @ManyToOne(() => Equipo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipoId' })
  equipo: Equipo;

  @CreateDateColumn()
  fecha: Date;

  @Column({ length: 20, default: 'Pendiente' })
  estado: string;
}