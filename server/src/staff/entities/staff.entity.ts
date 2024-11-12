import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/authentication/entities/authentication.entity';
import { STAFFROLE } from '../../utils/role.helper';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  staffId: string;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'text' })
  salary: string;

  @Column({
    type: 'enum',
    enum: STAFFROLE,
    nullable: false,
  })
  staffRole: STAFFROLE;

  @OneToOne(() => User, (user) => user.staff, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
