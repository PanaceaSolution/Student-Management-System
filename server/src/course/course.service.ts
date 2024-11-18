import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Student } from '../student/entities/student.entity'; 
import { CourseEnrollment } from '../course/course-enrollment/entities/course-enrollment.entity';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollmentRepository: Repository<CourseEnrollment>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}



  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    
    const teacher = await this.staffRepository.findOne({
      where: { staffId: createCourseDto.teacherId },
    });
  
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${createCourseDto.teacherId} not found`);
    }
  
    // Create the course with the teacher entity
    const course = this.courseRepository.create({
      ...createCourseDto,
      teacher,
    });
  
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findOne(courseId: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course;
  }

  async update(courseId: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(courseId);
    Object.assign(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async remove(courseId: string): Promise<void> {
    const result = await this.courseRepository.delete(courseId);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
  }
  

  // Enroll a student in a course
  async enrollStudent(courseId: string, studentId: string): Promise<CourseEnrollment> {
    const course = await this.findOne(courseId);
    const student = await this.studentRepository.findOne({ 
        where: { studentId: Equal(studentId) } 
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const enrollment = this.courseEnrollmentRepository.create({
      course,
      student,
      isCurrent: true,
    });
    return this.courseEnrollmentRepository.save(enrollment);
  }

  // Unenroll a student from a course
  async unenrollStudent(courseId: string, studentId: string): Promise<void> {
    const enrollment = await this.courseEnrollmentRepository.findOne({
      where: { 
        course: { courseId: Equal(courseId) }, 
        student: { studentId: Equal(studentId) } 
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment not found for course ID ${courseId} and student ID ${studentId}`);
    }

    await this.courseEnrollmentRepository.remove(enrollment);
  }

  // Get all students in a specific course
  async getEnrolledStudents(courseId: string): Promise<Student[]> {
    const enrollments = await this.courseEnrollmentRepository.find({
      where: { course: { courseId }, isCurrent: true },
      relations: ['student'],
    });
    return enrollments.map((enrollment) => enrollment.student);
  }
}