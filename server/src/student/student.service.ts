import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StudentDto } from './dto/student.dto';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Equal, Not, Repository } from 'typeorm';
import { User } from '../user/authentication/entities/authentication.entity';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { generateRandomPassword, generateUsername } from 'src/utils/utils';
import { uploadFilesToCloudinary } from 'src/utils/file-upload.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

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
      throw new BadRequestException(
        'Profile information (fname and lname) is required.',
      );
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
      const uploadedDocumentUrls = await uploadFilesToCloudinary(
        documentBuffers,
        'documents',
      );

      documentUrls.push(
        ...uploadedDocumentUrls.map((url, index) => ({
          documentName:
            documentMetadata[index]?.documentName || `Document ${index + 1}`,
          documentFile: url,
        })),
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

    const createUserResponse = await this.userService.register(
      registerDto,
      files,
    );
    // console.log("User Response", createUserResponse);
    

    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException(
        'Error occurs while creating user',
      );
    }

    const userReference = await this.userRepository.findOne({
      where: { userId: createUserResponse.user.id },
    });
    // console.log('Userreference', userReference);
    

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
      user:userReference,
    });
    
    await this.studentRepository.save(newStudent);

    return {
      status: 201,
      message: 'Student created successfully',
      student: newStudent,
      user: createUserResponse.user,
    };
  }

  async updateStudent(
    id: UUID,
    updateStudentDto: Partial<StudentDto>,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    } = {},
  ) {
    try {
    
      const {
        admissionDate,
        rollNumber,
        registrationNumber,
        religion,
        fatherName,
        motherName,
        guardianName,
        transportationMode,
        previousSchool,
        section,
        studentClass,
      } = updateStudentDto;

      // find student
      const student = await this.studentRepository.findOne({
        where: {
          studentId: Equal(id.toString()),
        },
        relations:[
          'user'
        ]
      });
      // console.log('student is', student);
      
      if (!student) {
        throw new NotFoundException('Student not found');
      }if (!student.user) {
        throw new NotFoundException('User associated with student not found');
      }
  const userUpdateResult = await this.userService.updateUser(
    student.user.userId,
    updateStudentDto,
    files,
  );

      if (fatherName !== undefined) {
        student.fatherName = fatherName;
      }
      if (motherName !== undefined) {
        student.motherName = motherName;
      }
      if (religion !== undefined) {
        student.religion = religion;
      }
      if (student.registrationNumber !== undefined) {
        student.registrationNumber = registrationNumber;
      }
      if (section !== undefined) {
        student.section = section;
      }
      if (guardianName !== undefined) {
        student.guardianName = guardianName;
      }
      if (studentClass !== undefined) {
        student.studentClass = studentClass;
      }
      if (previousSchool !== undefined) {
        student.previousSchool = previousSchool;
      }
      if (admissionDate !== undefined) {
        student.admissionDate = admissionDate;
      }
      if (rollNumber !== undefined) {
        student.rollNumber = rollNumber;
      }
      if (transportationMode !== undefined) {
        student.transportationMode = transportationMode;
      }

      await this.studentRepository.save(student);
      return {
        ...userUpdateResult.user.address,
        ...userUpdateResult.user.contact,
        ...userUpdateResult.user.documents,
        ...userUpdateResult.user.profile,
        student,
        message: 'Student updated successfully',
      };
    } catch (error) {
      throw new Error('Internal server problem');
    }
  }
}
