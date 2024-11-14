import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from './dto/student.dto';
import { RegisterUserDto } from '../user/authentication/dto/register.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // @Get('all-students')
  // async getStudents() {
  //   return this.studentService.GetAllStudents();
  // }
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ])
  )
  async createStudent(
    @Body() createStudentDto: StudentDto,
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] },
  ) {
    console.log('Received files:', files);
    console.log('Received body:', createStudentDto);
    return this.studentService.createStudent(createStudentDto, files);
  }
  @Get('')
  async getAllStudents(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.studentService.getAllStudents(page, limit);
  }
  
  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  async updateStudent(
    @Param('id') id: UUID,
    @Body() updateStudentDto: Partial<StudentDto>,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    } = {},
  ) {
    try {
      return this.studentService.updateStudent(id, updateStudentDto, files);
    } catch (error) {
      throw new BadRequestException(
        'Invalid data for updating students. Enter valid data',
      );
    }
  }

  // @Get('/:studentId')
  // async findStudent(
  //   @Param('studentId') studentId: number,
  // ): Promise<{ status: number; message?: string; student?: any }> {
  //   const uuid = studentId;
  //   return this.studentService.findStudent(uuid);
  // }

  // @Put('/link-parent')
  // async linkParent(
  //   @Body() linkParentDto: LinkParentDto,
  // ): Promise<{ status: number; message: string; result?: any }> {
  //   return this.studentService.linkParent(linkParentDto);
  // }

  // @Delete('/delete/:studentId')
  // async deleteStudent(
  //   @Param('studentId') studentId: number,
  // ): Promise<{ status: number; message?: string }> {
  //   return this.studentService.deleteStudent(studentId);
  // }
}
