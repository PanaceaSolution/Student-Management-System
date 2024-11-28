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
import ResponseModel, {
  decryptdPassword,
  generateRandomPassword,
  generateUsername,
} from 'src/utils/utils';
import { uploadFilesToCloudinary } from 'src/utils/file-upload.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Class } from 'src/classes/entities/class.entity';
import { ParentDto } from 'src/parent/dto/parent.dto';
import { GENDER, ROLE } from 'src/utils/role.helper';
import { ParentService } from 'src/parent/parent.service';
import { Parent } from 'src/parent/entities/parent.entity';


@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    private readonly parentService: ParentService,
    private readonly  authenticationService: AuthenticationService,
  ) {}
  async createStudent(
    createStudentDto: StudentDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
    createParent: boolean = true,
  ) {
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
      email,
      role,
      profile,
      address,
      contact,
      document,
      className,
      parentEmail,
    } = createStudentDto;
  
    console.log('createParent:', createParent);
  
    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException('Profile information (fname and lname) is required.');
    }
  
    const AD = moment(admissionDate, 'YYYY-MM-DD');
    if (!AD.isValid()) {
      throw new BadRequestException('Invalid date format for Admission Date');
    }
    const AdmissionIsoString = AD.toISOString();
  
    const studentExist = await this.studentRepository.findOne({
      where: [{ registrationNumber }],
    });
    if (studentExist) {
      throw new BadRequestException('Student already exists in the database');
    }
  
    const documentMetadata = document || [];
    const documentUrls = [];
    if (files.documents && files.documents.length > 0) {
      const documentBuffers = files.documents.map((doc) => doc.buffer);
      const uploadedDocumentUrls = await uploadFilesToCloudinary(documentBuffers, 'documents');
      documentUrls.push(
        ...uploadedDocumentUrls.map((url, index) => ({
          documentName: documentMetadata[index]?.documentName || `Document ${index + 1}`,
          documentFile: url,
        })),
      );
    }
  
    const studentClass = await this.classRepository.findOne({
      where: { className, section },
      select: ['classId', 'className'], // Ensure className is included
    });
    if (!studentClass) {
      throw new NotFoundException('Class not found');
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
      studentClassId: studentClass.classId,
      transportationMode,
    });
  
    try {
      const studentCreated = await this.studentRepository.save(newStudent);
  
      if (studentCreated) {
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
        };
  
        const createUserResponse = await this.userService.register(registerDto, files);
  
        if (!createUserResponse || !createUserResponse.user) {
          throw new InternalServerErrorException('Error occurs while creating user');
        }
  
        const userReference = await this.userRepository.findOne({
          where: { userId: createUserResponse.user.id },
        });
  
        if (!userReference) {
          throw new InternalServerErrorException('Error finding user after creation');
        }
  
        await this.studentRepository.save({
          ...newStudent,
          user: userReference,
        });
  
        if (createParent) {
          if (!parentEmail) {
            throw new BadRequestException('Parent email is required when createParent is true.');
          }
  
          const existingParentUser = await this.userRepository.findOne({
            where: { email: parentEmail },
            relations: ['profile', 'parent'],
          });
  
          if (
            existingParentUser?.profile &&
            (existingParentUser.profile.fname === fatherName || existingParentUser.profile.fname === motherName)
          ) {
            const parentData = await this.parentRepository.findOne({
              where: { user: { userId: existingParentUser.userId } },
              relations: ['student'],
            });
  
            if (parentData) {
              parentData.student.push(newStudent);
              await this.parentRepository.save(parentData);
              return new ResponseModel('Student linked to existing parent successfully', true, {
                student: { ...newStudent, className: studentClass.className }, // Add className
                parent: {
                  parent: parentData,
                },
              });
            }
          }
  
          const parentDto: ParentDto = {
            childNames: [`${profile.fname} ${profile.lname}`],
            email: parentEmail,
            role: ROLE.PARENT,
            profile: {
              fname: fatherName || 'Parent',
              lname: motherName || 'Unknown',
              gender: profile.gender,
              dob: profile.dob,
              profilePicture: profile.profilePicture,
            },
            contact,
            address,
            document: documentUrls,
            studentId: [studentCreated.studentId.toString()],
            createdAt: new Date().toISOString(),
            password: generateRandomPassword(),
          };
  
          try {
            const createParentResponse = await this.parentService.createParent(parentDto, files);
  
            if (!createParentResponse.plainPassword) {
              throw new InternalServerErrorException('Error occurs while creating parent');
            }
  
            return new ResponseModel('Student and Parent created successfully', true, {
              student: { ...newStudent,profile, className: studentClass.className }, 
              password: decryptdPassword(userReference.password),
              parent: {
                parent: createParentResponse.parent,
                plainPassword: createParentResponse.plainPassword,
              },
            });
          } catch (parentError) {
            console.error('Error during parent creation. Rolling back student...', parentError);
            await this.authenticationService.deleteUsers([userReference?.userId]);
            throw new InternalServerErrorException('Failed to create parent. Student has been rolled back.');
          }
        }
  
        return new ResponseModel('Student created successfully', true, {
          student: { ...newStudent, className: studentClass.className }, // Add className
          user: createUserResponse.user,
          password: decryptdPassword(userReference.password),
        });
      }
    } catch (studentError) {
      console.error('Error during createStudent. Rolling back...', studentError);
  
      if (newStudent?.user?.userId) {
        await this.authenticationService.deleteUsers([newStudent.user.userId]);
      }
  
      throw new InternalServerErrorException('Failed to create student due to an error.');
    }
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
      } = updateStudentDto;

      // find student
      const student = await this.studentRepository.findOne({
        where: {
          studentId: Equal(id.toString()),
        },
        relations: ['user'],
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }
      if (!student.user) {
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
      return new ResponseModel('Student updated successfully', true, {
        ...userUpdateResult.user.address,
        ...userUpdateResult.user.contact,
        ...userUpdateResult.user.documents,
        ...userUpdateResult.user.profile,
        student,
      });
    } catch (error) {
      return new ResponseModel('Error updating student', false, error);
    }
  }

  async getAllStudents(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const [students, total] = await this.studentRepository.findAndCount({
        relations: [
          'user',
          'user.profile',
          'user.contact',
          'user.address',
          'user.document',
        ],
        skip,
        take: limit,
      });

      const formattedStudents = students
        .filter((student) => student.user !== null)
        .map((student) => ({
          id: student.studentId,
          admissionDate: student.admissionDate,
          rollNumber: student.rollNumber,
          registrationNumber: student.registrationNumber,
          studentClass: student.studentClass,
          section: student.section,
          transportationMode: student.transportationMode,
          user: student.user && {
            id: student.user.userId,
            email: student.user.email,
            username: student.user.username,
            role: student.user.role,
            profile: student.user.profile,
            contact: student.user.contact,
            address: student.user.address,
            documents: student.user.document,
          },
        }));

      return new ResponseModel('Students fetched successfully', true, {
        data: formattedStudents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return new ResponseModel('Error fetching students', false, error);
    }
  }

  async getStudentsByClassAndSection(
    className: string,
    section: string,
    
  ) {
    try {
     

      const [students, total] = await this.studentRepository.findAndCount({
        relations: [
          'user',
          'user.profile',
          'user.contact',
          'user.address',
          'user.document',
          'studentClass',
        ],
        where: {
          studentClass: {
            className: className,
            section: section,
          },
        },
      });

      if (total === 0) {
        return new ResponseModel(
          `No students to fetch in class ${className} and section ${section}`,
          true,
          {
            className,
            section,
            students: [],
            total,
            totalPages: 0,
          },
        );
      }

      const formattedStudents = students
        .filter((student) => student.user !== null)
        .map((student) => ({
          rollNumber: student.rollNumber,
          firstName: student.user.profile.fname,
          lastName: student.user.profile.lname,
        }));

      return new ResponseModel('Students fetched successfully', true, {
        className,
        section,
        students: formattedStudents,
        total,
      });
    } catch (error) {
      return new ResponseModel('Error fetching students', false, error);
    }
  }

} 
