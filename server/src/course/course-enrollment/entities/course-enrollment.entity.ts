import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Student } from '../../student/entities/student.entity'; // Assume student entity exists

@Entity('course_enrollment')
export class CourseEnrollment {
  @PrimaryGeneratedColumn('uuid')
  enrollmentId: string;

  @ManyToOne(() => Course, { nullable: false })
  course: Course;

  @ManyToOne(() => Student, { nullable: false })
  student: Student;

  @Column({ default: true })
  isCurrent: boolean;
}