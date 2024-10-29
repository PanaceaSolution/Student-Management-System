import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Student } from './student.entity';

@Entity({ name: 'StudentContact' })
export class StudentContact {
  @PrimaryGeneratedColumn('uuid')
  studentContactId: string;

  @Column({ type: 'text', nullable: false })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  alternatePhoneNumber: string;

  @Column({ type: 'text', nullable: true })
  telephoneNumber: string;

  @ManyToOne(() => Student, (student) => student.contacts, { nullable: false, onDelete:'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}