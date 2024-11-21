import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Class } from 'src/classes/entities/class.entity';
import { User } from 'src/user/authentication/entities/authentication.entity';

@Entity()
export class Attendence {
  @PrimaryGeneratedColumn('uuid')
  attendanceId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean' })
  isPresent: boolean;

  @Column({ type: 'varchar' })
  section: string;

  @Column({ type: 'varchar' })
  className: string;

  @ManyToOne(() => Student, (student) => student.attendences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Class, (class_) => class_.attendences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classId' })
  class: Class;
  
  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'userId' })
  user: User;
}
