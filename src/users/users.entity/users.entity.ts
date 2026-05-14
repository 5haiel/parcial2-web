import { AppointmentsEntity } from 'src/appointments/appointments.entity/appointments.entity';
import { RolesEntity } from 'src/roles/roles.entity/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToMany(() => RolesEntity, (roles) => roles.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: RolesEntity[];

  @OneToMany(() => AppointmentsEntity, (appointments) => appointments.id_user)
  appointments!: AppointmentsEntity[];

  @OneToMany(() => AppointmentsEntity, (appointments) => appointments.id_doctor)
  doctorAppointments!: AppointmentsEntity[];
}
