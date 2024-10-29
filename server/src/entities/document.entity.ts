import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { User } from '../user/authentication/entities/authentication.entity';
@Entity({ name: 'userDocuments' })
export class UserDocuments {
    @PrimaryGeneratedColumn('uuid')
    documentId: UUID;

    @Column({type: 'text', nullable: true})
    documentName: string;
    
    @Column({type: 'text', nullable: false})
    documentFile: string;

    @ManyToOne(() => User, (user) => user.document, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;
}