import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { User } from '../authentication/entities/authentication.entity';

@Entity({ name: 'userAddress' })
export class UserAddress {
  map(arg0: (addr: any) => { addressType: any; wardNumber: any; municipality: any; district: any; province: any; }): any {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  addressId: UUID;

  @Column({ type: 'text', nullable: true })
  addressType: string;

  @Column({ type: 'text', nullable: false })
  wardNumber: string;

  @Column({ type: 'text', nullable: false })
  municipality: string;

  @Column({ type: 'text', nullable: false })
  district: string;

  @Column({ type: 'text', nullable: false })
  province: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isCurrent: boolean;

  @ManyToOne(() => User, (user) => user.address, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
