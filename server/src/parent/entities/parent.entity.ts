import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/authentication/entities/authentication.entity';
import { Student } from '../../student/entities/student.entity';

@Entity({ name: 'parents' })
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  fname: string;

  @Column({ type: 'text', nullable: false })
  lname: string;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  gender: string;

  @ManyToOne(() => User, (user) => user.parent)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Student, (student) => student.parent, { nullable: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
