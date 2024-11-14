import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/authentication/entities/authentication.entity';
import { Student } from '../../student/entities/student.entity';

@Entity({ name: 'Parent' })
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  parentId: string;

  @Column({ type: 'simple-array', nullable: true })
  childNames: string[];

  @ManyToOne(() => User, (user) => user.parent, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Student, (student) => student.parent, { nullable: true, eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
