import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { GENDER } from '../../utils/role.helper';
import { User } from '../authentication/entities/authentication.entity';

@Entity({ name: 'userProfile' })
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  profileId: string;

  @Column({ type: 'text', nullable: true })
  profilePicture: string;

  @Column({ type: 'text', nullable: false })
  fname: string;

  @Column({ type: 'text', nullable: false })
  lname: string;

  @Column({ type: 'enum', enum: GENDER, nullable: false })
  gender: GENDER;

  @Column({ type: 'date', nullable: false })
  dob: Date;

  @OneToOne(() => User, (user) => user.profile, { nullable: true }) // Set nullable: true here
  @JoinColumn({ name: 'userId' })
  user: User;
}