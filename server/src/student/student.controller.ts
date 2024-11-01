import { Controller, Post,Get, Body, Param, Put, Delete, Query, BadRequestException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto} from './dto/student.dto';
import { RegisterUserDto } from '../user/authentication/dto/register.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
    @Body() createStudentDto: any, // Use `any` to allow parsing in the controller
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] },
  ) {
    // Parse JSON strings for address, contact, and profile fields in `form-data`
    try {
      if (typeof createStudentDto.address === 'string') {
        createStudentDto.address = JSON.parse(createStudentDto.address);
      }
      if (typeof createStudentDto.contact === 'string') {
        createStudentDto.contact = JSON.parse(createStudentDto.contact);
      }
      if (typeof createStudentDto.profile === 'string') {
        createStudentDto.profile = JSON.parse(createStudentDto.profile);
      }
    } catch (error) {
      throw new BadRequestException('Invalid JSON format for address, contact, or profile');
    }

    // Call the service with the parsed data and files
    return this.studentService.createStudent(createStudentDto, files);
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

  // @Put('/update/:studentId')
  // async updateStudent(
  //   @Param('studentId') studentId: number,
  //   @Body() updateStudentDto: StudentDto,
  // ): Promise<{ status: number; message?: string; student?: any }> {
  //   return this.studentService.updateStudent(studentId, updateStudentDto);
  // }

  // @Delete('/delete/:studentId')
  // async deleteStudent(
  //   @Param('studentId') studentId: number,
  // ): Promise<{ status: number; message?: string }> {
  //   return this.studentService.deleteStudent(studentId);
  // }
}