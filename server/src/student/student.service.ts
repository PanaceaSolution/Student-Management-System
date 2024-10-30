import { Injectable, BadRequestException } from '@nestjs/common';
import { StudentDto } from './dto/student.dto';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { Parent } from '../parent/entities/parent.entity';
import { User } from '../user/authentication/entities/authentication.entity';
import { ROLE } from '../utils/role.helper';
import { generateUsername } from '../utils/utils';
import { generateRandomPassword } from '../utils/utils';
import { AuthenticationModule } from '../user/authentication/authentication.module';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { RegisterUserDto } from '../user/authentication/dto/register.dto';

@Injectable()
export class StudentService {
  // private generateStudentUsername(fname: string, lname: string): string {
  //   return generateUsername(fname, lname, ROLE.STUDENT);
  // }
  // private generateStudentPassword(): string {
  //   return generateRandomPassword();
  // }
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createStudent(
    createStudentDto: StudentDto,
    registerUserDto: RegisterUserDto,
  ): Promise<{ status: number; message: string; student?: any; user?: any }> {
    const {
      // yeti chaii student table ma janxa
      fatherName,
      motherName,
      guardianName,
      religion,
      bloodType,
      admissionDate,
      parentId,
      transportationMode,
      previousSchool,
      rollNumber,
      registrationNumber,
      section,
      studentClass,
      // // yo tala ko chaii User table ma janxa
      email,
      role,
      profile,
      address,
      contact,
      document,
      username,
      password,
      createdAt,
      refreshToken,
    } = createStudentDto;

    const registerDto = {
      email,
      role,
      profile,
      address,
      contact,
      document,
      username,
      password,
      createdAt,
      refreshToken,
    };
    const AD = moment(admissionDate, 'YYYY-MM-DD');
    if (!AD.isValid()) {
      throw new BadRequestException('Invalid date format for Admission Date');
    }
    const AdmissionIsoString = AD.toISOString();

    const studentExist = await this.studentRepository.findOne({
      where: [{ registrationNumber }, { rollNumber }],
    });
    if (studentExist) {
      return {
        status: 400,
        message: 'Student already exists in the student database',
      };
    }

    const userExist = await this.userRepository.findOne({
      where: { email },
    });
    if (userExist) {
      return {
        status: 400,
        message: 'Email already exists in the user database',
      };
    }

    const createUser = await this.userService.register(registerDto);
    if (!createUser || !createUser.user) {
      return {
        status: 500,
        message: 'Error occrs while creating user',
      };
    }
    //create the student finally here...
    const newStudent = await this.studentRepository.create({
      user: createUser.user,
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
      message: 'student created successfully',
      student: newStudent,
      user: createUser.user,
    };
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
