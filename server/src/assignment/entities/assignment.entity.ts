import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';

@Entity('assignment')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  assignmentId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', nullable:true })
  startDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @ManyToOne(() => Course, (course) => course.assignments)
  courseId: Course;

  // @ManyToOne(() => Class, (class) => class.assignments)
  // classId: Class;
  @ManyToOne(() => Class, (cls) => cls.assignments)
  classId: Class;

  @ManyToOne(() => Student, (student) => student.assignments)
  studentId: Student;

  @ManyToOne(() => Staff, (staff) => staff.assignments)
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
