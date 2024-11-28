import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Course } from 'src/course/entities/course.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import {
  deleteFileFromCloudinary,
  extractPublicIdFromUrl,
  uploadSingleFileToCloudinary,
} from 'src/utils/file-upload.helper';
import ResponseModel from 'src/utils/utils';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

 async create(createClassDto: CreateClassDto): Promise<Class> {
    try {
      // Check if the class with the same name and section already exists
      const existingClassAndSection = await this.classRepository.findOne({
        where: {
          className: createClassDto.className,
          section: createClassDto.section,
        },
      });

      if (existingClassAndSection) {
        throw new ConflictException(
          `Class ${createClassDto.className} with section ${createClassDto.section} already exists`,
        );
      }

      let routineFileUrl = null;

      // If routineFile is provided, upload it to Cloudinary
      if (createClassDto.routineFile) {
        const uploadResult = await uploadSingleFileToCloudinary(
          createClassDto.routineFile,
          'routines',
        );
        routineFileUrl = uploadResult.secure_url;
      }

      // Create a new class entity
      const newClass = this.classRepository.create({
        className: createClassDto.className,
        section: createClassDto.section,
        routineFile: routineFileUrl,
        // classTeacher,
        // classTeacherStaffId: createClassDto.classTeacherId,
      });

      // Save the new class entity to the database
      return await this.classRepository.save(newClass);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create class', error.message);
    }
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const existingClass = await this.findOne(id);
    const updateData: any = { ...updateClassDto };

    if (updateClassDto.routineFile) {
      if (existingClass.routineFile) {
        const publicId = extractPublicIdFromUrl(existingClass.routineFile);
        await deleteFileFromCloudinary(publicId);
      }

      const uploadResult = await uploadSingleFileToCloudinary(
        updateClassDto.routineFile,
        'routines',
      );
      updateData.routineFile = uploadResult.secure_url;
    }
    if (updateClassDto.subjects) {
      updateData.subjects = await this.courseRepository.findByIds(
        updateClassDto.subjects,
      );
    }

    if (updateClassDto.classTeacherId) {
      const classTeacher = await this.staffRepository.findOneBy({
        staffId: updateClassDto.classTeacherId,
      });

      if (!classTeacher) {
        throw new NotFoundException(
          `Staff with ID ${updateClassDto.classTeacherId} not found`,
        );
      }

      updateData.classTeacher = classTeacher;
      updateData.classTeacherStaffId = updateClassDto.classTeacherId; // Add this line
    }

    await this.classRepository.save({ classId: id, ...updateData });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const existingClass = await this.findOne(id);

    if (existingClass.routineFile) {
      const publicId = extractPublicIdFromUrl(existingClass.routineFile);
      await deleteFileFromCloudinary(publicId);
    }

    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
  }

  async findAll(): Promise<Class[]> {
    return this.classRepository.find({
      relations: ['classTeacher', 'subjects'],
    });
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { classId: id },
      relations: ['classTeacher', 'subjects'],
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return classEntity;
  }
}
