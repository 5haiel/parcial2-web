import { UsersEntity } from 'src/users/users.entity/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Enum {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
}

@Entity('appointments')
export class AppointmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  motivo!: string;

  @Column({ nullable: false, type: 'timestamp' })
  datetime!: Date;

  @Column({ type: 'enum', enum: Enum, default: Enum.PENDING })
  status!: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column()
  description!: string;

  @ManyToOne(() => UsersEntity, (users) => users.appointments)
  @JoinColumn({ name: 'id_user' })
  id_user!: UsersEntity;

  @ManyToOne(() => UsersEntity, (users) => users.doctorAppointments)
  @JoinColumn({ name: 'id_doctor' })
  id_doctor!: UsersEntity;
}
