import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { User } from '../authentication/entities/authentication.entity';

@Entity({ name: 'userDocuments' })
export class UserDocuments {
  map(arg0: (doc: any) => { documentName: any; documentFile: any; }): any {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  documentId: UUID;

  @Column({ type: 'text', nullable: false })
  documentName: string;

  @Column({type: 'text', nullable: false })
  documentFile: string;

  @ManyToOne(() => User, (user) => user.document, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
