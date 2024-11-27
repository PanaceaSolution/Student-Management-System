import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Express } from 'express';
import { uploadSingleFileToCloudinary } from 'src/utils/file-upload.helper';
import ResponseModel from 'src/utils/utils';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      createAssignmentDto.teacherFile = file;
      const assignment = await this.assignmentService.create(createAssignmentDto);
      return ResponseModel.success('Assignment created successfully', assignment); 
    } catch (error) {
      return ResponseModel.error('Failed to create assignment', error.message); 
    }
  }

  @Get()
  async findAll(): Promise<ResponseModel<Assignment[]>> {
    try {
      const assignments = await this.assignmentService.findAll();
      return ResponseModel.success('Assignments retrieved successfully', assignments); 
    } catch (error) {
      return ResponseModel.error('Failed to retrieve assignments', error.message);
    }
  }

  @Get(':assignmentId')
  async findOne(
    @Param('assignmentId') assignmentId: string,
  ): Promise<ResponseModel<Assignment>> {
    try {
      const assignment = await this.assignmentService.findOne(assignmentId);
      return ResponseModel.success('Assignment retrieved successfully', assignment); 
    } catch (error) {
      return ResponseModel.error('Failed to retrieve assignment', error.message); 
    }
  }

  @Put('/update/:assignmentId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('assignmentId') assignmentId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseModel<Assignment>> {
    try {
      if (file) {
        const uploadResult = await uploadSingleFileToCloudinary(
          file,
          'assignments',
        );
        updateAssignmentDto.teacherFile = uploadResult.secure_url;
      }
      const updatedAssignment = await this.assignmentService.update(assignmentId, updateAssignmentDto);
      return ResponseModel.success('Assignment updated successfully', updatedAssignment); 
    } catch (error) {
      return ResponseModel.error('Failed to update assignment', error.message); 
    }
  }

  @Delete(':assignmentId')
  async remove(@Param('assignmentId') assignmentId: string): Promise<ResponseModel<void>> {
    try {
      await this.assignmentService.remove(assignmentId);
      return ResponseModel.success('Assignment removed successfully', null); 
    } catch (error) {
      return ResponseModel.error('Failed to remove assignment', error.message); 
    }
  }

  @Post(':assignmentId/submit')
  @UseInterceptors(FileInterceptor('file'))
  async submitAssignment(
    @Param('assignmentId') assignmentId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseModel<Assignment>> {
    try {
      const uploadResult = await uploadSingleFileToCloudinary(
        file,
        'submissions',
      );
      const updateDto = new UpdateAssignmentDto();
      updateDto.studentFilePath = uploadResult.secure_url;
      const updatedAssignment = await this.assignmentService.update(assignmentId, updateDto);
      return ResponseModel.success('Assignment submitted successfully', updatedAssignment); 
    } catch (error) {
      return ResponseModel.error('Failed to submit assignment', error.message); 
    }
  }
}