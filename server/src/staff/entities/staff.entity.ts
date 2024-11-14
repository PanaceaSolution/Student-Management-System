import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/authentication/entities/authentication.entity';
import { STAFFROLE } from '../../utils/role.helper';
import { Course } from 'src/course/entities/course.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Assignment } from 'src/assignment/entities/assignment.entity';
@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  staffId: string;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'text' })
  salary: string;

  @Column({
    type: 'enum',
    enum: STAFFROLE,
    nullable: true,
  })
  staffRole: STAFFROLE;
  
  @OneToOne(() => User, (user) => user.staff, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Class, (class_) => class_.classTeacher)
  classes: Class[];

  @OneToMany(() => Assignment, (assignment) => assignment.staffId)
  assignments: Assignment[];

}
