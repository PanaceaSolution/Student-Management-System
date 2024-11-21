import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { CourseEnrollment } from './courseEnrollment/entities/course-enrollment.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file')) 
  create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File, 
  ): Promise<Course> {
    return this.courseService.create(createCourseDto, file);
  }

  @Get()
  findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get(':courseId')
  findOne(@Param('courseId') courseId: string): Promise<Course> {
    return this.courseService.findOne(courseId);
  }

  @Put('/update/:courseId') 
  @UseInterceptors(FileInterceptor('file')) 
  update(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file?: Express.Multer.File, 
  ): Promise<Course> {
    return this.courseService.update(courseId, updateCourseDto, file);
  }

  @Delete('/delete/:courseId')
  remove(@Param('courseId') courseId: string): Promise<void> {
    return this.courseService.remove(courseId);
  }

  // Enroll a student in a course
  @Post(':courseId/enroll/:studentId')
  enrollStudent(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ): Promise<CourseEnrollment> {
    return this.courseService.enrollStudent(courseId, studentId);
  }

  // Unenroll a student from a course
  @Delete(':courseId/unenroll/:studentId')
  unenrollStudent(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ): Promise<void> {
    return this.courseService.unenrollStudent(courseId, studentId);
  }

  // Get all students enrolled in a course
  @Get(':courseId/students')
  getEnrolledStudents(@Param('courseId') courseId: string): Promise<Student[]> {
    return this.courseService.getEnrolledStudents(courseId);
  }
}