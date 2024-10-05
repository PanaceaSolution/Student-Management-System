import { Controller, Post,Get, Body, Param, Put, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { Gender } from '@prisma/client';

@Controller("student")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/create')
  async createStudent(
    @Body('fname') fname: string,
    @Body('lname') lname: string,
    @Body('email') email: string,
    @Body('address') address: string,
    @Body('sex') sex: Gender,
    @Body('bloodtype') bloodtype: string,
    @Body('parentId') parentId: number,
    @Body('classId') classId: number,
    @Body('dob') dob: Date,
  ): Promise<{ status: number; message: string; student?: any }> {
    return this.studentService.createStudent(
      fname,
      lname,
      email,
      address,
      sex,
      bloodtype,
      parentId,
      classId,
      dob
    );
  }

  @Get('/:studentId')
  async findStudent(
    @Param('studentId') studentId: number
  ): Promise<{status: number, message?: string, student?:any}>{
    return this.studentService.findStudent(
      studentId
    )
  }

  @Put('/update/:studentId')
  async updateStudent(
    @Param('studentId') studentId: number,
    @Body('fname') fname?: string,
    @Body('lname') lname?: string,
    @Body('email') email?: string,
    @Body('address') address?: string,
    @Body('sex') sex?: Gender,
    @Body('bloodtype') bloodtype?: string,
    @Body('parentId') parentId?: number,
    @Body('classId') classId?: number,
    @Body('dob') dob?: Date,
  ): Promise<{ status: number; message?: string; student?: any }> {
    return this.studentService.updateStudent(
      studentId,
      fname,
      lname,
      email,
      address,
      sex,
      bloodtype,
      parentId,
      classId,
      dob
    );
  }

  @Delete('/delete/:studentId')
  async deleteStudent(
    @Param('studentId') studentId: number
  ): Promise<{status: number, message?: string}>{
    return this.studentService.deleteStudent(
      studentId
    )
  }
}
