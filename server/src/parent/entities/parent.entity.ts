import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/authentication/entities/authentication.entity';
import { Student } from '../../student/entities/student.entity';

@Entity({ name: 'Parent' })
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  parentId: string;

  @Column({ type: 'simple-array', nullable: true })
  childNames: string[];

  @OneToOne(() => User, (user) => user.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Student, (student) => student.parent, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student?: Student[];
}
