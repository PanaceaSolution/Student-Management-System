import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Express } from 'express';
import { uploadSingleFileToCloudinary } from 'src/utils/file-upload.helper';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))  
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Assignment> {
    try {
      
      createAssignmentDto.teacherFile = file;
      return this.assignmentService.create(createAssignmentDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get()
  async findAll(): Promise<Assignment[]> {
    return this.assignmentService.findAll();
  }

  @Get(':assignmentId')
  async findOne(@Param('assignmentId') assignmentId: string): Promise<Assignment> {
    return this.assignmentService.findOne(assignmentId);
  }

  @Put(':assignmentId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('assignmentId') assignmentId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Assignment> {
    try {
      if (file) {
        const uploadResult = await uploadSingleFileToCloudinary(file, 'assignments');
        updateAssignmentDto.teacherFile = uploadResult.secure_url;  
      }
      return this.assignmentService.update(assignmentId, updateAssignmentDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Delete(':assignmentId')
  async remove(@Param('assignmentId') assignmentId: string): Promise<void> {
    return this.assignmentService.remove(assignmentId);
  }

 
  @Post(':assignmentId/submit')
@UseInterceptors(FileInterceptor('file'))
async submitAssignment(
  @Param('assignmentId') assignmentId: string,
  @UploadedFile() file: Express.Multer.File
): Promise<Assignment> {
  try {
    const uploadResult = await uploadSingleFileToCloudinary(file, 'submissions');
    const updateDto = new UpdateAssignmentDto();
    updateDto.studentFile = uploadResult.secure_url;
    return this.assignmentService.update(assignmentId, updateDto);
  } catch (error) {
    throw new Error(error.message);
  }
}
}
