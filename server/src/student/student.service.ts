import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StudentDto } from './dto/student.dto';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { User } from '../user/authentication/entities/authentication.entity';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { generateRandomPassword, generateUsername } from 'src/utils/utils';
import { uploadFilesToCloudinary } from 'src/utils/file-upload.helper';


@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  async createStudent(
    createStudentDto: StudentDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ): Promise<{ status: number; message: string; student?: any; user?: any }> {
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

    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException('Profile information (fname and lname) is required.');
    }

    const AD = moment(admissionDate, 'YYYY-MM-DD');
    if (!AD.isValid()) {
      throw new BadRequestException('Invalid date format for Admission Date');
    }
    const AdmissionIsoString = AD.toISOString();

    const studentExist = await this.studentRepository.findOne({
      where: [{ registrationNumber }, { rollNumber }],
    });
    if (studentExist) {
      throw new BadRequestException('Student already exists in the database');
    }

    const profilePictureUrl: string | null = null;

    const documentMetadata = document || [];
    const documentUrls = [];

    if (files.documents && files.documents.length > 0) {
      const documentBuffers = files.documents.map((doc) => doc.buffer);
      const uploadedDocumentUrls = await uploadFilesToCloudinary(documentBuffers, 'documents');

      documentUrls.push(
        ...uploadedDocumentUrls.map((url, index) => ({
          documentName: documentMetadata[index]?.documentName || `Document ${index + 1}`,
          documentFile: url,
        }))
      );
    }

    const registerDto = {
      email,
      role,
      profile,
      address,
      contact,
      document: documentUrls,
      username: generateUsername(profile.fname, profile.lname, role),
      password: generateRandomPassword(),
      createdAt: new Date().toISOString(),
      refreshToken: null,
      profilePicture: profilePictureUrl,
    };

    const createUserResponse = await this.userService.register(registerDto, files);

    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException('Error occurs while creating user');
    }

    const userReference = await this.userRepository.findOne({
      where: { userId: createUserResponse.user.id },
    });

    if (!userReference) {
      return { status: 500, message: 'Error finding user after creation' };
    }

    const newStudent = this.studentRepository.create({
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
      user: createUserResponse.user,
    };
  }
  // Adjust the register function in the AuthenticationService

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
