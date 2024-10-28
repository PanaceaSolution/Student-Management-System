import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = new Assignment();
    Object.assign(assignment, createAssignmentDto);
    return this.assignmentRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.find();
  }

  async findOne(assignmentId: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { assignmentId } });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
    }
    return assignment;
  }

  async update(assignmentId: string, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(assignmentId); 
    Object.assign(assignment, updateAssignmentDto);
    return this.assignmentRepository.save(assignment);
  }

  async remove(assignmentId: string): Promise<void> {
    const result = await this.assignmentRepository.delete(assignmentId);
    if (result.affected === 0) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
    }
  }
}
