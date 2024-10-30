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
import { Student } from '../../../student/entities/student.entity';
import { UserProfile } from '../../userEntity/profile.entity';
import { UserAddress } from '../../userEntity/address.entity';
import { UserDocuments } from '../../userEntity/document.entity';
import { UserContact } from '../../userEntity/contact.entity';


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

  @Column({ type: 'boolean', nullable: true })
  isActivated: boolean;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  profile: UserProfile;

  @OneToMany(() => UserAddress, (address) => address.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  address: UserAddress;

  @OneToOne(() => UserContact, (contact) => contact.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  contact: UserContact;

  @OneToMany(() => UserDocuments, (document) => document.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  document: UserDocuments;

  @OneToOne(() => Student, (student) => student.user, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  student: Student;
}
