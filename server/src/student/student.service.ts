import { Injectable } from '@nestjs/common';
import { PrismaService } from '../DB/prisma.service';
import { CloudinaryProvider } from '../uploads/cloudinary.provider';
import { CreateStudentDto, UpdateStudentDto, LinkParentDto, FilterStudentDto} from './dto/student.dto';
import Express from 'express';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryProvider: CloudinaryProvider,
  ) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
    profilePicture: Express.Multer.File,
    documentFiles: Express.Multer.File[],
  ): Promise<{ status: number; message: string; student?: any; login?: any; documentUrls?: string[]; profilePictureUrl?: string; }> {
    const {
      fname,
      lname,
      email,
      permanentAddress,
      temporaryAddress,
      sex,
      bloodtype,
      dob,
      father_name,
      mother_name,
      admission_date,
    } = createStudentDto;
     
  
    // Check if student already exists
    const studentExist = await this.prisma.student.findUnique({
      where: { email },
    });
  
    if (studentExist) {
      // Modify this return statement to include all required properties
      return { 
        status: 400, 
        message: 'Student already exists in the database',
        profilePictureUrl: '', // or any default value you want to use
      };
    }
  
    const address = await this.prisma.address.create({
      data: {
        permanentAddress: {
          create: permanentAddress,
        },
        temporaryAddress: {
          create: temporaryAddress,
        },
      },
    });
  
    // Upload profile picture to Cloudinary
    const uploadedProfilePicture = await this.cloudinaryProvider.uploadImage(profilePicture);
    const profilePictureUrl = uploadedProfilePicture.secure_url;
  
    // // Upload documents to Cloudinary
    const uploadedDocuments = await Promise.all(
      documentFiles.map((file) => this.cloudinaryProvider.uploadImage(file)),
    );
  
    // Create student entry with separate profile picture
    const student = await this.prisma.student.create({
      data: {
        fname,
        lname,
        email,
        addressId: address.id,
        sex,
        bloodtype,
        dob,
        father_name,
        mother_name,
        admission_date,
        profilePicture: profilePictureUrl,
        documents: {
          create: uploadedDocuments.map((doc) => ({
            type: 'document',
            url: doc.secure_url,
            ownerType: 'STUDENT',
          })),
        },
      },
    });
  
    const paddedId = student.id.toString().padStart(4, '0');
    const studentUsername = `ST-${fname.charAt(0)}${lname.charAt(0)}${paddedId}`.toUpperCase();
    const studentPassword = this.generateRandomPassword();
  
    const login = await this.prisma.login.create({
      data: {
        username: studentUsername,
        password: studentPassword,
        role: 'STUDENT',
      },
    });
  
    const newStudent = await this.prisma.student.update({
      where: { id: student.id },
      data: { username: studentUsername, loginId: login.id },
    });
  
    const documentUrls = uploadedDocuments.map(doc => doc.secure_url);
  
    return {
      status: 200,
      message: 'Student created successfully',
      student: newStudent,
      login,
      documentUrls,
      profilePictureUrl,
    };
  }

  async GetAllStudents(filterDto: FilterStudentDto): Promise<{
    status: number;
    message: string;
    students?: any;
  }> {
    const { name, gender, createdAfter, createdBefore } = filterDto;
    const where: any = {};
    if (name) {
      where.OR = [
        { fname: { contains: name, mode: 'insensitive' } },
        { lname: { contains: name, mode: 'insensitive' } },
      ];
    }

    if (gender) {
      where.sex = gender;
    }

    if (createdAfter || createdBefore) {
      where.admission_date = {};
      if (createdAfter) {
        where.admission_date.gte = createdAfter;
      }
      if (createdBefore) {
        where.admission_date.lte = createdBefore;
      }
    }

    const students = await this.prisma.student.findMany({
      where,
    });

    return {
      status: 200,
      message: 'Students fetched successfully',
      students,
    };
  }

  async linkParent(
    linkParentDto: LinkParentDto,
  ): Promise<{ status: number; message: string; result?: any }> {
    const { parentId, studentId } = linkParentDto;
    const findStudent = await this.findStudent(studentId);
    if (!findStudent.student) {
      return { status: 400, message: 'Student not found' };
    }

    const result = await this.prisma.student.update({
      where: { id: studentId },
      data: { parentId },
    });

    return {
      status: 200,
      message: 'Parent linked successfully',
      result,
    };
  }

  async findStudent(
    studentId: number,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const findStudent = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!findStudent) {
      return {
        status: 400,
        message: 'Student does not exist',
      };
    }
    return {
      status: 200,
      message: 'Student found',
      student: findStudent,
    };
  }

  async updateStudent(
    studentId: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const findStudent = await this.findStudent(studentId);
    if (findStudent.status === 200) {
      const {
        fname,
        lname,
        email,
        permanentAddress,
        temporaryAddress,
        sex,
        bloodtype,
        dob,
        father_name,
        mother_name,
        admission_date,
      } = updateStudentDto;

      await this.prisma.address.update({
        where: { id: findStudent.student.addressId },
        data: {
          ...(permanentAddress && {
            permanentAddress: {
              update: permanentAddress,
            },
          }),
          ...(temporaryAddress && {
            temporaryAddress: {
              update: temporaryAddress,
            },
          }),
        },
      });

      const updatedStudent = await this.prisma.student.update({
        where: { id: studentId },
        data: {
          ...(fname !== undefined && { fname }),
          ...(lname !== undefined && { lname }),
          ...(email !== undefined && { email }),
          ...(sex !== undefined && { sex }),
          ...(bloodtype !== undefined && { bloodtype }),
          ...(dob !== undefined && { dob }),
          ...(father_name !== undefined && { father_name }),
          ...(mother_name !== undefined && { mother_name }),
          ...(admission_date !== undefined && { admission_date }),
        },
      });

      return {
        status: 200,
        message: 'Student updated successfully',
        student: updatedStudent,
      };
    } else {
      return {
        status: 400,
        message: 'Student not found',
      };
    }
  }

  async deleteStudents(
    studentIds: number[],
  ): Promise<{ status: number; message?: string }> {
    if (!studentIds || studentIds.length === 0) {
      return { status: 400, message: 'No student IDs provided' };
    }
  
    const ids = studentIds.map(Number).filter(id => !isNaN(id));
  
    const findStudents = await this.prisma.student.findMany({
      where: { id: { in: ids } },
    });
    if (findStudents.length === 0) {
      return { status: 400, message: 'No students found for the provided IDs' };
    }

    await this.prisma.student.deleteMany({
      where: { id: { in: ids } },
    });
    
    return { status: 200, message: `${findStudents.length} students deleted successfully` };
  }
  

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}
