import { Controller, Post,Get, Body, Param, Put, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';

@Controller("student")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/create')
  async createStudent(
    @Body() createStudentDto: CreateStudentDto
  ): Promise<{ status: number; message: string; student?: any }> {
    return this.studentService.createStudent(
      createStudentDto
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
    @Body() updateStudentDto: UpdateStudentDto
  ): Promise<{ status: number; message?: string; student?: any }> {
    return this.studentService.updateStudent(
      studentId,
      updateStudentDto
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
