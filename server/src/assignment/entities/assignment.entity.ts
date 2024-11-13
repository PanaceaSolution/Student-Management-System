import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Student } from '../../student/entities/student.entity'; 
import { Staff } from 'src/staff/entities/staff.entity';

@Entity('assignment')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  assignmentId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @ManyToOne(() => Course, (course) => course.assignments)
  courseId: Course;

  @ManyToOne(() => Student, (student) => student.assignments)
  studentId: Student;

  @ManyToOne(() => Staff , (staff) => staff.assignments)
  staffId: Staff;

  @Column({ type: 'date', nullable: true })
  submissionDate: Date;

  @Column({ type: 'text', nullable: true })
  grade: string;

  @Column({ nullable: true })
  teacherFilePath?: string;

  @Column({ nullable: true })
  studentFilePath?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
