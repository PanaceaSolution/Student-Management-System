import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { StudentDto } from './dto/student.dto';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { User } from '../user/authentication/entities/authentication.entity';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { RegisterUserDto } from '../user/authentication/dto/register.dto';
import { generateRandomPassword, generateUsername } from 'src/utils/utils';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createStudent(
    createStudentDto: StudentDto,
    files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] },
  ): Promise<{ status: number; message: string; student?: any; user?: any }> {
    try {
      const {
        fatherName,
        motherName,
        guardianName,
        religion,
        bloodType,
        admissionDate,
        transportationMode,
        previousSchool,
        rollNumber,
        registrationNumber,
        section,
        studentClass,
        email,
        role,
        profile,
        address,
        contact,
        document,
      } = createStudentDto;

      // Parse and validate the admission date
      const AD = moment(admissionDate, 'YYYY-MM-DD');
      if (!AD.isValid()) {
        throw new BadRequestException('Invalid date format for Admission Date');
      }
      const AdmissionIsoString = AD.toISOString();

      // Check if the student already exists
      const studentExist = await this.studentRepository.findOne({
        where: [{ registrationNumber }, { rollNumber }],
      });
      if (studentExist) {
        return { status: 400, message: 'Student already exists in the student database' };
      }

      // Check if the user already exists
      const userExist = await this.userRepository.findOne({ where: { email } });
      if (userExist) {
        return { status: 400, message: 'Email already exists in the user database' };
      }

      // Prepare registration DTO for the user with ISO string for `createdAt`
      const registerDto: RegisterUserDto = {
        email,
        role,
        profile,
        address,
        contact,
        document,
        username: generateUsername(profile.fname, profile.lname, role),
        password: generateRandomPassword(),
        createdAt: new Date().toISOString(), 
        refreshToken: null,
      };

      // Register the user and handle files (profile picture and documents)
      const createUser = await this.userService.register(registerDto, files);

      if (!createUser || !createUser.user) {
        throw new InternalServerErrorException('Error occurs while creating user');
      }

      // Retrieve a reference to the user from the database to ensure compatibility
      const userReference = await this.userRepository.findOne({
        where: { userId: createUser.user.id },
      });

      if (!userReference) {
        return { status: 500, message: 'Error finding user after creation' };
      }

      // Create the student record with a reference to the user
      const newStudent = this.studentRepository.create({
        user: userReference, // Use the fully-compatible reference
        fatherName,
        motherName,
        guardianName,
        religion,
        bloodType,
        admissionDate: AdmissionIsoString,
        registrationNumber,
        rollNumber,
        previousSchool,
        section,
        studentClass,
        transportationMode,
      });

      await this.studentRepository.save(newStudent);

      return {
        status: 201,
        message: 'Student created successfully',
        student: newStudent,
        user: createUser.user,
      };
    } catch (error) {
      console.error('Error in createStudent function:', error);
      throw new InternalServerErrorException('An unexpected error occurred during student creation');
    }
  }

  // async GetAllStudents(): Promise<{
  //   status: number;
  //   message: string;
  //   student?: any;
  // }> {
  //   const students = await this.studentRepository.find({
  //     relations: {
  //       addresses: true,
  //       contacts: true,
  //       parent: true,
  //     },
  //   });

  //   return {
  //     status: 201,
  //     message: 'All students fetched',
  //     student: students,
  //   };
  // }

  // async findStudent(studentId: number): Promise<{
  //   status: number;
  //   message?: string;
  //   student?: any;
  //   user?: any;
  // }> {
  //   try {
  //     const findStudent = await this.studentRepository.findOne({
  //       where: {
  //         studentId: studentId,
  //       },
  //       relations: {
  //         addresses: true,
  //         contacts: true,
  //         parent: true,
  //       },
  //     });
  //     const UserData = await this.userRepository.findOne({
  //       where: {
  //         userId: findStudent.studentId,
  //       },
  //     });
  //     if (!findStudent) {
  //       return {
  //         status: 400,
  //         message: 'student does not exist',
  //       };
  //     }
  //     return {
  //       status: 200,
  //       message: 'student found',
  //       student: findStudent,
  //       user: UserData,
  //     };
  //   } catch (error) {
  //     console.error('Error finding student:', error);
  //     return {
  //       status: 500,
  //       message: 'Internal server error',
  //     };
  //   }
  // }

  // async updateStudent(
  //   studentId: number,
  //   updateStudentDto: StudentDto,
  // ): Promise<{ status: number; message?: string; student?: any }> {
  //   const findStudent = await this.findStudent(studentId);
  //   if (findStudent.status === 200) {
  //     const {
  //       fname,
  //       lname,
  //       email,
  //       gender,
  //       bloodType,
  //       dob,
  //       admissionDate,
  //       address,
  //       contact,
  //       parentId,
  //       transportationMode,
  //       previousSchool,
  //       rollNumber,
  //       registrationNumber,
  //       section,
  //       studentClass,
  //     } = updateStudentDto;
  //     console.log('findStudent:', findStudent);
  //     if (rollNumber && rollNumber !== findStudent.student.rollNumber) {
  //       const existingRollNumber = await this.studentRepository.findOne({
  //         where: { rollNumber },
  //       });
  //       if (existingRollNumber) {
  //         return { status: 400, message: 'Roll number already exists' };
  //       }
  //     }

  //     if (
  //       registrationNumber &&
  //       registrationNumber !== findStudent.student.registrationNumber
  //     ) {
  //       const existingRegistrationNumber = await this.studentRepository.findOne(
  //         {
  //           where: { registrationNumber },
  //         },
  //       );
  //       if (existingRegistrationNumber) {
  //         return {
  //           status: 400,
  //           message: 'Registration number already exists',
  //         };
  //       }
  //     }

  //     if (
  //       Array.isArray(findStudent.student.addresses) &&
  //       findStudent.student.addresses.length > 0
  //     ) {
  //       if (address) {
  //         for (const addr of findStudent.student.addresses) {
  //           await this.addressRepository.update(addr.studentAddressId, {
  //             ...address,
  //           });
  //         }
  //       }
  //     } else {
  //       return { status: 400, message: 'Address not found' };
  //     }

  //     if (
  //       Array.isArray(findStudent.student.contacts) &&
  //       findStudent.student.contacts.length > 0
  //     ) {
  //       if (contact) {
  //         for (const cont of findStudent.student.contacts) {
  //           await this.contactRepository.update(cont.studentContactId, {
  //             ...contact,
  //           });
  //         }
  //       }
  //     } else {
  //       return { status: 400, message: 'Contact not found' };
  //     }

  //     await this.studentRepository.update(studentId, {
  //       fname,
  //       lname,
  //       email,
  //       gender,
  //       bloodType,
  //       dob,
  //       admissionDate,
  //       transportationMode,
  //       previousSchool,
  //       rollNumber,
  //       registrationNumber,
  //       section,
  //       studentClass,
  //     });

  //     const updatedStudent = await this.studentRepository.findOne({
  //       where: { studentId: studentId },
  //       relations: {
  //         addresses: true,
  //         contacts: true,
  //         parent: true,
  //       },
  //     });
  //     return {
  //       status: 200,
  //       message: 'Student updated successfully',
  //       student: updatedStudent,
  //     };
  //   } else {
  //     return { status: 404, message: 'Student not found' };
  //   }
  // }

  // async deleteStudent(
  //   studentId: number,
  // ): Promise<{ status: number; message?: string }> {
  //   const findStudent = await this.studentRepository.findOne({
  //     where: { studentId: studentId },
  //     relations: {
  //       addresses: true,
  //       contacts: true,
  //       parent: true,
  //       user: true,
  //     },
  //   });

  //   if (!findStudent) {
  //     return { status: 400, message: 'Student not found' };
  //   }
  //   await this.studentRepository.delete({ studentId: studentId });
  //   await this.userRepository.delete({ userId: findStudent.user.userId });

  //   return { status: 200, message: 'Student deleted successfully' };
  // }
}
