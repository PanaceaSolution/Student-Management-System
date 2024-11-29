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
import { UpdateCourseDto } from 'src/course/dto/update-course.dto';

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

async update(classId: string, updateClassDto: UpdateClassDto): Promise<Class> {
    try {
      const existingClass = await this.classRepository.findOne({ where: { classId } });
      if (!existingClass) {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }
  
      let routineFileUrl = existingClass.routineFile;
  
      // Handle routineFile update
      if (updateClassDto.routineFile) {
        if (routineFileUrl) {
          const publicId = extractPublicIdFromUrl(routineFileUrl);
          await deleteFileFromCloudinary(publicId);
        }
        const uploadResult = await uploadSingleFileToCloudinary(
          updateClassDto.routineFile,
          'routines',
        );
        routineFileUrl = uploadResult.secure_url;
      }
  
      Object.assign(existingClass, {
        ...updateClassDto,
        routineFile: routineFileUrl,
      });
  
      return await this.classRepository.save(existingClass);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update class', error.message);
    }
  }

async remove(classId: string): Promise<void> {
    try {
      const existingClass = await this.classRepository.findOne({ where: { classId } });
      if (!existingClass) {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }
  
      // Delete routineFile from Cloudinary if it exists
      if (existingClass.routineFile) {
        const publicId = extractPublicIdFromUrl(existingClass.routineFile);
        await deleteFileFromCloudinary(publicId);
      }
  
      await this.classRepository.remove(existingClass);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove class', error.message);
    }
  }

async findOne(classId: string): Promise<Class> {
    try {
      const classEntity = await this.classRepository.findOne({ where: { classId } });
      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }
      return classEntity;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find class', error.message);
    }
  }
  
async findAll(): Promise<Class[]> {
    try {
      return await this.classRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve classes', error.message);
    }
  }
}