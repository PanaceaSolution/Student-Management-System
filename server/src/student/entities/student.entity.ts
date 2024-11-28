import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';

import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import { TRANSPORTATION_MODE } from '../../utils/role.helper';
import { User } from '../../user/authentication/entities/authentication.entity';
import { Assignment } from 'src/assignment/entities/assignment.entity';
import { Course } from 'src/course/entities/course.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { Attendence } from 'src/attendence/entities/attendence.entity';
import { Class } from 'src/classes/entities/class.entity';

@Entity({ name: 'Student' })
@Unique(['studentClassId', 'rollNumber'])
export class Student {
  @PrimaryGeneratedColumn('uuid')
  studentId: UUID;

  @Column({ type: 'date', nullable: true })
  admissionDate: Date;

  // @Column({ type: 'text', default: 'defaultClass', nullable: false })
  // studentClass: string;

  @Column({ type: 'text', default: 'defaultSection', nullable: false })
  section: string;

  @Column({ type: 'text', nullable: true })
  bloodType: string;

  @Column({ type: 'text', nullable: true })
  fatherName: string;

  @Column({ type: 'text', nullable: true })
  motherName: string;

  @Column({ type: 'text', nullable: true })
  guardianName: string;

  @Column({ type: 'text', nullable: true })
  religion: string;

  @Column({ type: 'text', nullable: true })
  previousSchool: string;

  @Column({ type: 'text', nullable: false })
  rollNumber: string;

  @Column({ type: 'text', nullable: false })
  registrationNumber: string;

  @Column({ type: 'text', nullable: true })
  transportationMode: TRANSPORTATION_MODE;

  @Column({ type: 'simple-array', nullable: true })
  isPresent: string[];

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Assignment, (assignment) => assignment.studentId)
  assignments: Assignment[];

  @ManyToOne(() => Course, (course) => course.courseId)
  course: Course[];

  // @ManyToOne(() => Parent, (parent) => parent.students, { nullable: true })
  // @JoinColumn({ name: 'parentId' })
  // parent: Parent;
  @OneToMany(() => Attendence, (attendence) => attendence.classId)
  attendences: Attendence[];

  @ManyToOne(() => Parent, (parent) => parent.student, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Parent;

  @Column({ type: 'uuid' })
  studentClassId: string;

  @ManyToOne(() => Class, (studentClass) => studentClass.students)
  @JoinColumn({ name: 'studentClassId' })
  studentClass?: Class;
}
