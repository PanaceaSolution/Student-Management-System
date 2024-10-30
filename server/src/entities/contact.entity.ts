import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/authentication/entities/authentication.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Entity({ name: 'userContact' })
export class UserContact {
  @PrimaryGeneratedColumn('uuid')
  contactId: UUID;

  @Column({ type: 'text', nullable: false })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  alternatePhoneNumber: string;

  @Column({ type: 'text', nullable: true })
  telephoneNumber: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isCurrent: boolean;

  @ManyToOne(() => User, (user) => user.contact, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
