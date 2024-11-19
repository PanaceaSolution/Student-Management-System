import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import {
  deleteFileFromCloudinary,
  extractPublicIdFromUrl,
  uploadSingleFileToCloudinary,
} from 'src/utils/file-upload.helper';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  async create(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<{ status: Number; message: string, assignment:any }> {
    let teacherFilePath: string | null = null;

    if (createAssignmentDto.teacherFile) {
      const uploadResult = await uploadSingleFileToCloudinary(
        createAssignmentDto.teacherFile,
        'assignments',
      );
      teacherFilePath = uploadResult.secure_url;
    }

    const assignment = this.assignmentRepository.create({
      ...createAssignmentDto,
      teacherFilePath,
      courseId: createAssignmentDto.courseId,
      teacherId: createAssignmentDto.teacherId,
      studentId: createAssignmentDto.studentId,
    } as DeepPartial<Assignment>);
    // return (await this.assignmentRepository.save(assignment))[0];
    await this.assignmentRepository.save(assignment);

    return {
      status: 201,
      message: 'Assignment create successfull',
      assignment,
    };
  }

  async update(
    assignmentId: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const existingAssignment = await this.findOne(assignmentId);

    // Handle file replacement if a new file is uploaded
    if (updateAssignmentDto.teacherFile) {
      if (existingAssignment.teacherFilePath) {
        const publicId = extractPublicIdFromUrl(
          existingAssignment.teacherFilePath,
        );
        await deleteFileFromCloudinary(publicId);
      }
      const uploadResult = await uploadSingleFileToCloudinary(
        updateAssignmentDto.teacherFile,
        'assignments',
      );
      existingAssignment.teacherFilePath = uploadResult.secure_url;
    }

    // Assign remaining properties and save
    Object.assign(existingAssignment, updateAssignmentDto);
    return this.assignmentRepository.save(existingAssignment);
  }

  async remove(assignmentId: string): Promise<void> {
    const existingAssignment = await this.findOne(assignmentId);

    // Delete associated file from Cloudinary if it exists
    if (existingAssignment.teacherFilePath) {
      const publicId = extractPublicIdFromUrl(
        existingAssignment.teacherFilePath,
      );
      await deleteFileFromCloudinary(publicId);
    }

    const result = await this.assignmentRepository.delete(assignmentId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Assignment with ID ${assignmentId} not found`,
      );
    }
  }

  public async findOne(assignmentId: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentId },
    });
    if (!assignment) {
      throw new NotFoundException(
        `Assignment with ID ${assignmentId} not found`,
      );
    }
    return assignment;
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.find();
  }
}
