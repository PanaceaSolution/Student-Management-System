import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Course } from 'src/course/entities/course.entity';
import { Staff } from 'src/staff/entities/staff.entity';

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

  async findAll(): Promise<Class[]> {
    return this.classRepository.find({ relations: ['classTeacher', 'subjects'] });
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

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const subjects = await this.courseRepository.findByIds(createClassDto.subjects);
    const classTeacher = await this.staffRepository.findOneBy({ 
      staffId: createClassDto.classTeacherId 
    });

    if (!classTeacher) {
      throw new NotFoundException(`Staff with ID ${createClassDto.classTeacherId} not found`);
    }

    const newClass = this.classRepository.create({
      className: createClassDto.className,
      section: createClassDto.section,
      routineFile: createClassDto.routineFile,
      subjects,
      classTeacher,
      classTeacherStaffId: createClassDto.classTeacherId  
    });
    return this.classRepository.save(newClass);
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const updateData: any = { ...updateClassDto };

    if (updateClassDto.subjects) {
      updateData.subjects = await this.courseRepository.findByIds(updateClassDto.subjects);
    }
    
    if (updateClassDto.classTeacherId) {
      const classTeacher = await this.staffRepository.findOneBy({ 
        staffId: updateClassDto.classTeacherId 
      });
      
      if (!classTeacher) {
        throw new NotFoundException(`Staff with ID ${updateClassDto.classTeacherId} not found`);
      }

      updateData.classTeacher = classTeacher;
      updateData.classTeacherStaffId = updateClassDto.classTeacherId;  // Add this line
    }

    await this.classRepository.save({ classId: id, ...updateData });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
  }
}
