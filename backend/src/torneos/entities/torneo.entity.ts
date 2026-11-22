import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('torneos')
export class Torneo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 60 })
  videojuego: string;

  @Column({ length: 30 })
  modalidad: string;

  @Column({ type: 'date' })
  fechaInicio: string;

  @Column({ type: 'date' })
  cierreInscripcion: string;

  @Column('int')
  cupoMaximo: number;

  @Column({ length: 20, default: 'Abierto' })
  estado: string;
}