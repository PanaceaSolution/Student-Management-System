import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { ROLE } from '../../../utils/role.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import { UserProfile } from '../../../common/profile.entity';
import { UserAddress } from '../../../common/address.entity';
import { UserDocuments } from '../../../common/document.entity';
import { UserContact } from '../../../common/contact.entity';

import { Staff } from '../../../staff/entities/staff.entity';
import { Student } from '../../../student/entities/student.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: UUID;

  @Column({ type: 'text', nullable: true, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true, unique: true })
  username: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: false })
  role: ROLE;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  isActivated: boolean;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  profile: UserProfile;

  @OneToMany(() => UserAddress, (address) => address.user, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  address: UserAddress;

  @OneToOne(() => UserContact, (contact) => contact.user, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  contact: UserContact;

  @OneToMany(() => UserDocuments, (document) => document.user, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  document: UserDocuments;

  @OneToOne(() => Student, (student) => student.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student;

  @OneToOne(() => Staff, (staff) => staff.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}
