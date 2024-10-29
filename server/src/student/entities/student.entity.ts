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
import { StudentContact } from './studentContact.entity';
import { StudentAddress } from './studentAddress.entity';
import { User } from '../../user/authentication/entities/user.entity';

@Entity({ name: 'Student' })
export class Student {
  @PrimaryGeneratedColumn('uuid')
  studentId: UUID;

  @Column({ type: 'text', nullable: false })
  fname: string;

  @Column({ type: 'text', nullable: false })
  lname: string;

  @Column({ type: 'text', nullable: false })
  gender: GENDER;

  @Column({ type: 'date', nullable: false })
  dob: Date;

  @Column({ type: 'date', nullable: true })
  admissionDate: Date;

  @Column({ type: 'text', default: 'defaultClass', nullable: false })
  studentClass: string;

  @Column({ type: 'text', default: 'defaultSection', nullable: false })
  section: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  bloodType: string;

  @Column({
    type: 'text',
    default: 'defaultRollNumber',
    nullable: false,
    unique: true,
  })
  rollNumber: string;

  @Column({ type: 'text', nullable: true, unique: true })
  registrationNumber: string;

  @Column({ type: 'text', nullable: true })
  transportationMode: TRANSPORTATION_MODE;

  @Column({ type: 'text', nullable: true })
  previousSchool: string;

  @OneToMany(() => StudentContact, (contact) => contact.student, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  contacts: StudentContact[];

  @OneToMany(() => StudentAddress, (address) => address.student, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  addresses: StudentAddress[];

  @OneToOne(() => User, (user) => user.student, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  // @ManyToOne(() => Parent, (parent) => parent.students, { nullable: true })
  // @JoinColumn({ name: 'parentId' })
  // parent: Parent;
}
