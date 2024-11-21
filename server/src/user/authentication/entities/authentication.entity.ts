import { Parent } from '../../../parent/entities/parent.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { ROLE } from '../../../utils/role.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Student } from '../../../student/entities/student.entity';
import { UserProfile } from '../../userEntity/profile.entity';
import { UserAddress } from '../../userEntity/address.entity';
import { UserDocuments } from '../../userEntity/document.entity';
import { UserContact } from '../../userEntity/contact.entity';
import { Staff } from '../../../staff/entities/staff.entity';
import { RefreshToken } from 'src/user/userEntity/refresh-token.entity';
import { Attendence } from 'src/attendence/entities/attendence.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: UUID;

  @Column({ type: 'text', nullable: true, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true, unique: true })
  username: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: false })
  role: ROLE;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  isActivated: boolean;

  @CreateDateColumn()
  createdAt: Date;

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
    nullable: true,
  })
  document: UserDocuments;

  @OneToOne(() => Student, (student) => student.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  student: Student;

  @OneToMany(() => Attendence, (attendence) => attendence.user)
  attendances: Attendence[];

  @OneToOne(() => Parent, (parent) => parent.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  parent: Parent;

  @OneToOne(() => Staff, (staff) => staff.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  staff: Staff;
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}