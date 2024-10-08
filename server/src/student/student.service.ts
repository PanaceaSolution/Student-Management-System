import { Injectable } from '@nestjs/common';
import { PrismaService } from '../DB/prisma.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  LinkParentDto,
} from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<{ status: number; message: string; student?: any; login?: any; }> {
    const { fname, lname, email, address, sex, bloodtype, dob } =
      createStudentDto;
    const studentExist = await this.prisma.student.findFirst({
      where: {
        email,
      },
    });

    if (studentExist) {
      return { status: 400, message: 'Student already exists in the database' };
    }

    await this.prisma.student.create({
      data: {
        fname,
        lname,
        email,
        address,
        sex,
        bloodtype,
        dob,
      },
    });

    const findStudent = await this.prisma.student.findUnique({
      where: {
        email: String(email),
      },
    });

    const studentId = findStudent.id;
    const paddedId = studentId.toString().padStart(4, '0');
    let studentUsername = `${fname.charAt(0)}${lname.charAt(0)}-${paddedId}`;
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
      login: login
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

  async findStudent(
    studentId: number,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const findStudent = await this.prisma.student.findUnique({
      where: {
        id: Number(studentId),
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
    };
  }

  async updateStudent(
    studentId: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const findStudent = this.findStudent(studentId);
    if ((await findStudent).status == 200) {
      const { fname, lname, email, address, sex, bloodtype, dob } =
        updateStudentDto;
      const updatedStudent = await this.prisma.student.update({
        where: {
          id: Number(studentId),
        },
        data: {
          ...(fname !== undefined && { fname }),
          ...(lname !== undefined && { lname }),
          ...(email !== undefined && { email }),
          ...(address !== undefined && { address }),
          ...(sex !== undefined && { sex }),
          ...(bloodtype !== undefined && { bloodtype }),
          ...(dob !== undefined && { dob }),
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
    const findStudent = await this.prisma.student.findUnique({
      where: { id: Number(studentId) },
    });
    if (!findStudent) {
      return { status: 400, message: 'Student not found' };
    }
    await this.prisma.student.delete({ where: { id: studentId } });
    await this.prisma.login.delete({ where: { id: findStudent.loginId } });
    return { status: 200, message: 'Student deleted successfully' };
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}