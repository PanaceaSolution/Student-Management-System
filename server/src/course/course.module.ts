import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './entities/course.entity';
import { StudentModule } from 'src/student/student.module';
import { CourseEnrollment } from './course-enrollment/entities/course-enrollment.entity';
import { StaffModule } from 'src/staff/staff.module';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course,Student, CourseEnrollment]),
    StudentModule,StaffModule
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}