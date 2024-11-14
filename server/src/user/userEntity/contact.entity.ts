import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../authentication/entities/authentication.entity';
import { UUID } from 'crypto';

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

  @Column({ type: 'boolean', nullable: true, default: true })
  isActivated: boolean;
  

  @ManyToOne(() => User, (user) => user.contact, { nullable: true,onDelete: 'CASCADE',onUpdate:'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
