import { Controller, Post,Get, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto} from './dto/student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all-students')
  async getStudents() {
    return this.studentService.GetAllStudents();
  }
  @Post('create')
  async createStudent(@Body() createStudentDto: StudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get('/:studentId')
  async findStudent(
    @Param('studentId') studentId: number,
  ): Promise<{ status: number; message?: string; student?: any }> {
    const uuid = studentId;
    return this.studentService.findStudent(uuid);
  }

  // @Put('/link-parent')
  // async linkParent(
  //   @Body() linkParentDto: LinkParentDto,
  // ): Promise<{ status: number; message: string; result?: any }> {
  //   return this.studentService.linkParent(linkParentDto);
  // }

  @Put('/update/:studentId')
  async updateStudent(
    @Param('studentId') studentId: number,
    @Body() updateStudentDto: StudentDto,
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