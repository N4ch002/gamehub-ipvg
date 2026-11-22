import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nombre: string;

  @Column('int')
  capitanId: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'capitanId' })
  capitan: Usuario;

  @Column({ length: 60 })
  juegoPreferido: string;

  @Column({ length: 20, default: 'Activo' })
  estado: string;

  @ManyToMany(() => Usuario)
  @JoinTable({
    name: 'equipo_integrantes',
    joinColumn: { name: 'equipoId' },
    inverseJoinColumn: { name: 'usuarioId' },
  })
  integrantes: Usuario[];
}