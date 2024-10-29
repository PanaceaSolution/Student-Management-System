import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseEnrollmentModule } from './course-enrollment/course-enrollment.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [CourseEnrollmentModule],
})
export class CourseModule {}
