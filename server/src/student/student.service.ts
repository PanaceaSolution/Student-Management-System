import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../DB/prisma.service';
import { Gender } from '@prisma/client';
import {
  CreateStudentDto,
  UpdateStudentDto,
  LinkParentDto,
} from './dto/student.dto';
import moment from 'moment';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<{ status: number; message: string; student?: any; login?: any }> {
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


    const DOB = moment(dob, 'YYYY-MM-DD');
    if (!DOB.isValid()) {
      throw new BadRequestException('Invalid date format for Date of Birth');
    }
    const DobIsoString = DOB.toISOString();

    const admissionDateIso = new Date(admission_date);
    if (isNaN(admissionDateIso.getTime())) {
      throw new BadRequestException('Invalid date format for Admission Date');
    }
    const AdmissionIsoString = admissionDateIso.toISOString();

    const studentExist = await this.prisma.student.findFirst({
      where: {
        email,
      },
    });

    if (studentExist) {
      return { status: 400, message: 'Student already exists in the database' };
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

    await this.prisma.student.create({
      data: {
        fname,
        lname,
        email,
        addressId: address.id,
        sex,
        bloodtype,
        dob: DobIsoString,
        father_name,
        mother_name,
        admission_date: AdmissionIsoString,
      },
    });

    const findStudent = await this.prisma.student.findUnique({
      where: {
        email: String(email),
      },
    });

    const studentId = findStudent.id;
    const paddedId = studentId.toString().padStart(4, '0');
    let studentUsername = `ST-${fname.charAt(0)}${lname.charAt(0)}${paddedId}`;
    studentUsername = studentUsername.toUpperCase();
    const studentPassword = this.generateRandomPassword();

    const login = await this.prisma.login.create({
      data: {
        username: studentUsername,
        password: studentPassword,
        role: 'STUDENT',
      },
    });

    const newStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: { username: studentUsername, loginId: login.id },
    });

    return {
      status: 200,
      message: 'Student created successfully',
      student: newStudent,
      login: login,
    };
  }

  async GetAllStudents(): Promise<{
    status: number;
    message: string;
    student?: any;
  }> {
    const students = await this.prisma.student.findMany();

    return {
      status: 201,
      message: 'All students fetched',
      student: students,
    };
  }

  async linkParent(
    linkParentDto: LinkParentDto,
  ): Promise<{ status: number; message: string; result?: any }> {
    const { parentId, studentId } = linkParentDto;
    const findStudent = this.findStudent(studentId);
    if (!findStudent) {
      return { status: 400, message: 'student not found' };
    }
    const result = await this.prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        parentId: parentId,
      },
    });
    return {
      status: 200,
      message: 'Parent linked successfully',
      result: result,
    };
  }

  async findStudent(studentId: number): Promise<{
    status: number;
    message?: string;
    student?: any;
    loginData?: any;
  }> {
    try {
      const findStudent = await this.prisma.student.findUnique({
        where: {
          id: studentId, // No need to convert to Number since it's already a number
        },
      });
      const loginData = await this.prisma.login.findFirst({
        where: {
          id: findStudent.loginId,
        },
      });
      if (!findStudent) {
        return {
          status: 400,
          message: 'student does not exist',
        };
      }
      return {
        status: 200,
        message: 'student found',
        student: findStudent,
        loginData: loginData,
      };
    } catch (error) {
      console.error('Error finding student:', error);
      return {
        status: 500,
        message: 'Internal server error',
      };
    }
  }

  async updateStudent(
    studentId: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const findStudent = this.findStudent(studentId);
    if ((await findStudent).status == 200) {
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
        where: { id: (await findStudent).student.addressId },
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
        where: {
          id: Number(studentId),
        },
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
        message: 'student updated successfully',
        student: updatedStudent,
      };
    } else {
      return {
        status: 400,
        message: 'student not found',
      };
    }
  }

  async deleteStudent(
    studentId: number,
  ): Promise<{ status: number; message?: string }> {
    const findStudent = await this.prisma.student.findFirst({
      where: { id: Number(studentId) },
    });
    if (!findStudent) {
      return { status: 400, message: 'Student not found' };
    }
    await this.prisma.student.delete({ where: { id: Number(studentId) } });
    await this.prisma.login.delete({ where: { id: findStudent.loginId } });
    return { status: 200, message: 'Student deleted successfully' };
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}
