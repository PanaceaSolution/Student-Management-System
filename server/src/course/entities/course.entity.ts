import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity'; 
import { Class } from 'src/classes/entities/class.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  courseId: string;

  @Column()
  courseName: string;

  @Column('text')
  courseDescription: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @ManyToOne(() => Staff, (staff) => staff.courses, { nullable: false })
  teacher: Staff;

  @Column({ default: true })
  isCurrent: boolean;

  @OneToMany(() => Class, (class_) => class_.classTeacher)
  classes: Class[];
}