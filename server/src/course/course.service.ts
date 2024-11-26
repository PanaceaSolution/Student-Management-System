import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Student } from '../student/entities/student.entity'; 
import { CourseEnrollment } from './courseEnrollment/entities/course-enrollment.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { uploadSingleFileToCloudinary } from 'src/utils/file-upload.helper';
import { User } from 'src/user/authentication/entities/authentication.entity';

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

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}



  async create(createCourseDto: CreateCourseDto, file?: Express.Multer.File): Promise<Course> {
    if (file) {
      createCourseDto.file = file.path; 
    }

    
    const userProfile = await this.userRepository.findOne({
      where: {
        profile: {
          fname: createCourseDto.fname,
          lname: createCourseDto.lname,
        },
      },
      relations: ['profile'], 
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    
    let teachers: Staff[] = [];

    const staff = await this.staffRepository.findOne({
      where: { user: userProfile }, 
    });

    if (staff) {
      teachers.push(staff); 
    }

   
    const course = new Course();
    course.courseName = createCourseDto.courseName;
    course.courseDescription = createCourseDto.courseDescription;
    course.file = createCourseDto.file;
    course.teachers = teachers; 

    return await this.courseRepository.save(course).then(savedCourse => {
      return {
        ...savedCourse,
        fname: createCourseDto.fname,
        lname: createCourseDto.lname,
      };
    });
}
    

async update(courseId: string, updateCourseDto: UpdateCourseDto, file?: Express.Multer.File): Promise<Course & { fname: string; lname: string }> {
  const course = await this.findOne(courseId);

  if (file) {
    const folder = 'courses';
    const uploadResult = await uploadSingleFileToCloudinary(file, folder);
    course.file = uploadResult.secure_url;
  }

  
  Object.assign(course, updateCourseDto);

  const savedCourse = await this.courseRepository.save(course);

  
  const teacherProfiles = await this.staffRepository.findByIds(course.teachers);
  const teacherNames = teacherProfiles.map(teacher => ({
    fname: teacher.user.profile.fname,
    lname: teacher.user.profile.lname,
  }));

  return {
    ...savedCourse,
    fname: teacherNames.map(t => t.fname).join(', '),
    lname: teacherNames.map(t => t.lname).join(', '),
  };
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

  

  async remove(courseId: string): Promise<void> {
    const course = await this.courseRepository.findOne({ where: { courseId } }); 
    if (!course) {
      throw new Error('Course not found');
    }
    await this.courseRepository.remove(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      select: ['courseId', 'courseName', 'courseDescription', 'file'], 
    });
  }
  
  async findOne(courseId: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { courseId },
      select: ['courseId', 'courseName', 'courseDescription', 'file'], 
    });
  
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
  
    return course;
  }

  
}