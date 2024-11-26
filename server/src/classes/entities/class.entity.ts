import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';
import { Course } from '../../course/entities/course.entity';
import { v4 as uuidv4 } from 'uuid';
import { Attendence } from 'src/attendence/entities/attendence.entity';
import { Student } from 'src/student/entities/student.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  classId: string = uuidv4();

  @Column('text')
  className: string;

  @Column('text')
  section: string;

  
@Column('simple-array', { nullable: true })
  subject: string[];
  

  @Column('text', { nullable: true })
  routineFile: string;

  @ManyToOne(() => Staff, (staff) => staff.classes, { nullable: false })
  @JoinColumn({ name: 'classTeacherStaffId' })
  classTeacher: Staff;

  @Column('text', { nullable: true })
  classTeacherStaffId: string;

  @ManyToMany(() => Course, (course) => course.classes, { eager: true })
  @JoinTable()
  subjects: Course[];
  assignments: any;

  @OneToMany(() => Attendence, (attendence) => attendence.classId)
  @JoinTable()
  attendences: Attendence[];

  @OneToMany(()=>Student, (student)=>student.studentClass)
  // @JoinTable()
  students: Student[];
}
