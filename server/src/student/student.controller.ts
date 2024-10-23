import { Controller, Post,Get, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto, LinkParentDto } from './dto/student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all-students')
  async getStudents() {
    return this.studentService.GetAllStudents();
  }
  @Post('create')
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<{ status: number; message: string; student?: any }> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Put('/link-parent')
  async linkParent(
    @Body() linkParentDto: LinkParentDto,
  ): Promise<{ status: number; message: string; result?: any }> {
    return this.studentService.linkParent(linkParentDto);
  }
  @Get('/:studentId')
  async findStudent(
    @Param('studentId') studentId: string,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const id = parseInt(studentId, 10);
    if (isNaN(id)) {
      return {
        status: 400,
        message: 'Invalid student ID',
      };
    }
    return this.studentService.findStudent(id);
  }

  @Put('/update/:studentId')
  async updateStudent(
    @Param('studentId') studentId: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<{ status: number; message?: string; student?: any }> {
    return this.studentService.updateStudent(studentId, updateStudentDto);
  }

  @Delete('/delete/:studentId')
  async deleteStudent(
    @Param('studentId') studentId: number,
  ): Promise<{ status: number; message?: string }> {
    return this.studentService.deleteStudent(studentId);
  }
}
