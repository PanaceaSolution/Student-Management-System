import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';
import { Course } from '../../course/entities/course.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  classId: string = uuidv4();

  @Column('text')
  className: string;

  @Column('text')
  section: string;

  @Column('text', { nullable: true })
  routineFile: string;

  @ManyToOne(() => Staff, staff => staff.classes, { nullable: false })
  @JoinColumn({ name: 'classTeacherStaffId' })
  classTeacher: Staff;

  @Column()
  classTeacherStaffId: string;

  @ManyToMany(() => Course, (course) => course.classes, { eager: true })
  @JoinTable()
  subjects: Course[];
  assignments: any;
}
