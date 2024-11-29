import {
  Entity,
  PrimaryGeneratedColumn,
  Column,

} from 'typeorm';


@Entity()
export class Attendence {
  @PrimaryGeneratedColumn('uuid')
  attendanceId: string;

  @Column({ type: Date, nullable: true })
  date: Date;
 
  @Column({ type: 'simple-json', nullable: true })
  classId: string[];

  
}
