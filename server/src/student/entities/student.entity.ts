import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { UUID } from 'typeorm/driver/mongodb/bson.typings';


import { TRANSPORTATION_MODE } from '../../utils/role.helper';
import { User } from '../../user/authentication/entities/authentication.entity';
import { Assignment } from 'src/assignment/entities/assignment.entity';
import { Parent } from 'src/parent/entities/parent.entity';

@Entity({ name: 'Student' })
export class Student {
  @PrimaryGeneratedColumn('uuid')
  studentId: UUID;

  @Column({ type: 'date', nullable: true })
  admissionDate: Date;

  @Column({ type: 'text', default: 'defaultClass', nullable: false })
  studentClass: string;

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

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Assignment, (assignment) => assignment.studentId)
  assignments: Assignment[];

  @ManyToOne(() => Parent, (parent) => parent.student, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Parent;
}
