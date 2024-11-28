import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity'; 
import { Class } from 'src/classes/entities/class.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  courseId: string;

  @Column()
  courseName: string;

  @Column('text')
  courseDescription: string;


  @ManyToMany(() => Staff, (staff) => staff.courses)
  @JoinTable()
  teachers: Staff[];

  @Column({ nullable: true })
  file: string; 

  // @Column({ type:"simple-array",nullable: true })
  // teachers: Array<string>;

  @OneToMany(() => Class, (class_) => class_.classTeacher)
  classes: Class[];

  @OneToMany(() => Assignment, assignment => assignment.courseId)
  assignments: Assignment[];
}