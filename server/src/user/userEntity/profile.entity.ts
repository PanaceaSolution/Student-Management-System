import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { GENDER } from '../../utils/role.helper'; 
import { User } from '../authentication/entities/authentication.entity'; 

@Entity({ name: 'userProfile' })
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    profileId: UUID;

    @Column({type: 'text', nullable: true})
    profilePicture: string;
    
    @Column({type: 'text', nullable: false})
    fname: string;
    
    @Column({type: 'text', nullable: false})
    lname: string;
    
    @Column({type: 'enum', enum: GENDER, nullable: false})
    gender: GENDER;
    
    @Column({type: 'date', nullable: true})
    dob: Date;

    @OneToOne(() => User, (user) => user.profile, { nullable: true})
    @JoinColumn({ name: 'userId' })
    user: User;
}