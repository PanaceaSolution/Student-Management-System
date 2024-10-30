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

import { GENDER } from '../../utils/role.helper';

// import { Parent } from '../../parent/entities/parent.entity';

import { TRANSPORTATION_MODE } from '../../utils/role.helper';
import { User } from '../../user/authentication/entities/authentication.entity';

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
  
  @OneToOne(() => User, (user) => user.student)
  @JoinColumn({ name: 'userId' })
  user: User;
  parent: any;

  // @ManyToOne(() => Parent, (parent) => parent.students, { nullable: true })
  // @JoinColumn({ name: 'parentId' })
  // parent: Parent;
}
