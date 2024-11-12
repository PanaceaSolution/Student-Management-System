import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    return this.assignmentService.create(createAssignmentDto);
  }

  @Get()
  findAll(): Promise<Assignment[]> {
    return this.assignmentService.findAll();
  }

  @Get(':assignmentId')
  findOne(@Param('assignmentId') assignmentId: string): Promise<Assignment> {
    return this.assignmentService.findOne(assignmentId);
  }

  @Put(':assignmentId')
  update(
    @Param('assignmentId') assignmentId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    return this.assignmentService.update(assignmentId, updateAssignmentDto);
  }

  @Delete(':assignmentId')
  remove(@Param('assignmentId') assignmentId: string): Promise<void> {
    return this.assignmentService.remove(assignmentId);
  }
}
