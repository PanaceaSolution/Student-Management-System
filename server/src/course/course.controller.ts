import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import ResponseModel from 'src/utils/utils'; 
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file')) 
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file?: Express.Multer.File, 
  ) {
    try {
      
      if (file) {
        createCourseDto.file = file.path; 
      }
      const course = await this.courseService.create(createCourseDto);
      return ResponseModel.success('Course created successfully', course); 
    } catch (error) {
      return ResponseModel.error('Failed to create course', error.message); 
    }
  }

  @Get()
  async findAll() {
    try {
      const courses = await this.courseService.findAll();
      return ResponseModel.success('Courses retrieved successfully', courses); 
    } catch (error) {
      return ResponseModel.error('Failed to retrieve courses', error.message); 
    }
  }

  @Get(':courseId')
  async findOne(@Param('courseId') courseId: string) {
    try {
      const course = await this.courseService.findOne(courseId);
      return ResponseModel.success('Course retrieved successfully', course); 
    } catch (error) {
      return ResponseModel.error('Failed to retrieve course', error.message); 
    }
  }

  @Put('/update/:courseId') 
  @UseInterceptors(FileInterceptor('file')) 
  async update(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file?: Express.Multer.File, 
  ) {
    try {
      
      if (file) {
        updateCourseDto.file = file.path; 
      }
      const updatedCourse = await this.courseService.update(courseId, updateCourseDto);
      return ResponseModel.success('Course updated successfully', updatedCourse);
    } catch (error) {
      return ResponseModel.error('Failed to update course', error.message); 
    }
  }

  @Delete('/delete/:courseId')
  async remove(@Param('courseId') courseId: string) {
    try {
      await this.courseService.remove(courseId);
      return ResponseModel.success('Course removed successfully', null);
    } catch (error) {
      return ResponseModel.error('Failed to remove course', error.message); 
    }
  }

  // Enroll a student in a course
  @Post(':courseId/enroll/:studentId')
  async enrollStudent(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    try {
      const enrollment = await this.courseService.enrollStudent(courseId, studentId);
      return ResponseModel.success('Student enrolled successfully', enrollment);
    } catch (error) {
      return ResponseModel.error('Failed to enroll student', error.message); 
    }
  }

  // Unenroll a student from a course
  @Delete(':courseId/unenroll/:studentId')
  async unenrollStudent(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    try {
      await this.courseService.unenrollStudent(courseId, studentId);
      return ResponseModel.success('Student unenrolled successfully', null); 
    } catch (error) {
      return ResponseModel.error('Failed to unenroll student', error.message); 
    }
  }

  // Get all students enrolled in a course
  @Get(':courseId/students')
  async getEnrolledStudents(@Param('courseId') courseId: string) {
    try {
      const students = await this.courseService.getEnrolledStudents(courseId);
      return ResponseModel.success('Enrolled students retrieved successfully', students); 
    } catch (error) {
      return ResponseModel.error('Failed to retrieve enrolled students', error.message); 
    }
  }
}