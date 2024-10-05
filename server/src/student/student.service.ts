import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/DB/prisma.service';
import { Gender } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async createStudent(
    fname: string,
    lname: string,
    email: string,
    address: string,
    sex: Gender,
    bloodtype: string,
    parentId: number,
    classId: number,
    dob: Date,
  ): Promise<{ status: number; message: string; student?: any }> {
    const studentExist = await this.prisma.testStudent.findFirst({
      where: {
        email,
      },
    });

    if (studentExist) {
      return { status: 400, message: 'Student already exists in the database' };
    }

    await this.prisma.testStudent.create({
      data: {
        fname,
        lname,
        email,
        address,
        sex,
        bloodtype,
        parentId,
        classId,
        dob,
      },
    });

    const findStudent = await this.prisma.testStudent.findUnique({
      where: {
        email: String(email),
      },
    });

    const studentId = findStudent.id;
    let studentUsername = `${fname.charAt(0)}${lname.charAt(0)}-${studentId}`;
    studentUsername = studentUsername.toUpperCase();
    const newStudent = await this.prisma.testStudent.update({
      where: { email },
      data: { username: studentUsername },
    });

    return {
      status: 200,
      message: 'Student created successfully',
      student: newStudent,
    };
  }

  async findStudent(
    studentId: number,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const findStudent = await this.prisma.testStudent.findUnique({
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
    fname?: string,
    lname?: string,
    email?: string,
    address?: string,
    sex?: Gender,
    bloodtype?: string,
    parentId?: number,
    classId?: number,
    dob?: Date,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const updatedStudent = await this.prisma.testStudent.update({
      where: {
        id: Number(studentId),
      },
      data: {
        ...(fname && { fname }),
        ...(lname && { lname }),
        ...(email && { email }),
        ...(address && { address }),
        ...(sex && { sex }),
        ...(bloodtype && { bloodtype }),
        ...(parentId && { parentId }),
        ...(classId && { classId }),
        ...(dob && { dob }),
      },
    });
    return {
      status: 200,
      message: 'student updated successfully',
      student: updatedStudent,
    };
  }

  async deleteStudent(
    studentId: number,
  ): Promise<{ status: number; message?: string }> {
    const findStudent = await this.prisma.testStudent.findUnique({
      where: { id: Number(studentId) },
    });
    if (!findStudent) {
      return { status: 400, message: 'Student not found' };
    }
    await this.prisma.testStudent.delete({ where: { id: studentId } });
    return { status: 200, message: 'Student deleted successfully' };
  }
}
