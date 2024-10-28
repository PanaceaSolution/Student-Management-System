import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Student } from './student.entity';

@Entity({ name: 'StudentAddress' })
export class StudentAddress {
  @PrimaryGeneratedColumn('uuid')
  studentAddressId: string;

  @Column({ type: 'text', nullable: false })
  wardNumber: string;

  @Column({ type: 'text', nullable: true })
  municipality: string;

  @Column({ type: 'text', nullable: true })
  district: string;

  @Column({ type: 'text', nullable: true })
  province: string;

  @ManyToOne(() => Student, (student) => student.addresses, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
