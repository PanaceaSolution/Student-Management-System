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
  @Body() createStudentDto: any,
  @UploadedFiles() files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] },
) {
  console.log('Received files:', files);
  console.log('Received body:', createStudentDto);

  try {
    // Parse JSON fields if they are in string format
    if (typeof createStudentDto.profile === 'string') {
      createStudentDto.profile = JSON.parse(createStudentDto.profile);
    }
    if (typeof createStudentDto.address === 'string') {
      createStudentDto.address = JSON.parse(createStudentDto.address);
    }
    if (typeof createStudentDto.contact === 'string') {
      createStudentDto.contact = JSON.parse(createStudentDto.contact);
    }
  } catch (error) {
    throw new BadRequestException('Invalid JSON format for address, contact, or profile');
  }


  return this.studentService.createStudent(createStudentDto, files);
}

@Get('all-students')
  async getStudents(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page) || 1; 
    const pageSize = parseInt(limit) || 8; 
    return this.studentService.getAllStudents(pageNumber, pageSize);
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.studentService.findStudentById(id);
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