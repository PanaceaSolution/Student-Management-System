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

  @Column({ type: Date, nullable: true })
  date: Date;

  @Column({ type: 'simple-json', nullable: true })
  classId: string[];
}