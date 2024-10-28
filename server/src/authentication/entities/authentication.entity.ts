import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';

import { ROLE } from '../../utils/role.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Student } from '../../student/entities/student.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: UUID;

  @Column({ type: 'text', nullable: true, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false, unique: true })
  username: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: false })
  role: ROLE;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'text', nullable: true })
  profilePicture: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActivated: boolean;

  @OneToOne(() => Student, (student) => student.user, {nullable:true, onDelete:'CASCADE'})
  @JoinColumn()
  student: Student;
}
