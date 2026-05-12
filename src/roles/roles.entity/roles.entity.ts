import { UsersEntity } from 'src/users/users.entity/users.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  role_name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToMany(() => UsersEntity, (users) => users.roles)
  users!: UsersEntity[];
}
