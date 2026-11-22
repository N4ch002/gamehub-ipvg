import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50, unique: true })
  alias: string;

  @Column({ length: 100, unique: true })
  correo: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 20, default: 'estudiante' })
  rol: string;

  @Column({ default: true })
  activo: boolean;
}