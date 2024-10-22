import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  LinkParentDto,
  FilterStudentDto,
} from './dto/student.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/')
  async getStudents(@Query() filterDto: FilterStudentDto) {
    return this.studentService.GetAllStudents(filterDto);
  }

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('profilePicture'), // Assuming 'profilePicture' is the field name in the form data
    FilesInterceptor('documents'), // Assuming 'documents' is the field name for multiple file uploads
  )
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile() profilePicture: Express.Multer.File,
    @UploadedFiles() documentFiles: Express.Multer.File[],
  ): Promise<{ status: number; message: string; student?: any; login?: any }> {
    return this.studentService.createStudent(createStudentDto, profilePicture, documentFiles);
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
