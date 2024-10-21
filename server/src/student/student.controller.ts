import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  LinkParentDto,
  FilterStudentDto,
} from './dto/student.dto';
import { Query } from '@nestjs/common';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all-students')
  async getStudents(@Query() filterDto: FilterStudentDto) {
    return this.studentService.GetAllStudents(filterDto);
  }
  @Post('create')
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<{ status: number; message: string; student?: any }> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get('/:studentId')
  async findStudent(
    @Param('studentId') studentId: number,
  ): Promise<{ status: number; message?: string; student?: any }> {
    return this.studentService.findStudent(studentId);
  }

  @Put('/update/:studentId')
  async updateStudent(
    @Param('studentId') studentId: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<{ status: number; message?: string; student?: any }> {
    return this.studentService.updateStudent(studentId, updateStudentDto);
  }

  @Delete('/delete')
  async deleteStudent(
    @Body('studentIds') studentIds: number[],
  ): Promise<{ status: number; message?: string }> {
    return this.studentService.deleteStudents(studentIds);
  }

  @Put('/link-parent')
  async linkParent(
    @Body() linkParentDto: LinkParentDto,
  ): Promise<{ status: number; message: string; result?: any }> {
    return this.studentService.linkParent(linkParentDto);
  }
}
