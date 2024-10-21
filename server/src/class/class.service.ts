import { Injectable } from '@nestjs/common';
import { PrismaService } from '../DB/prisma.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(
    createClassDto: CreateClassDto,
  ): Promise<{ status: number; message: string; class?: any }> {
    const { className } = createClassDto;
    const classExist = await this.prisma.class.findFirst({
      where: { className },
    });
    if (classExist) {
      return {
        status: 400,
        message: 'class already exists',
      };
    }
    const newClass = await this.prisma.class.create({
      data: {
        className,
      },
    });
    return {
      status: 200,
      message: 'class created successfully',
      class: newClass,
    };
  }

  async getClasses(classId?: number): Promise<{
    status: number;
    message: string;
    class?: any;
    classes?: any[];
  }> {
    if (classId) {
      const findClass = await this.prisma.class.findUnique({
        where: { id: Number(classId) },
      });
  
      if (!findClass) {
        return {
          status: 400,
          message: 'Class does not exist',
        };
      }
  
      return {
        status: 200,
        message: 'Class fetched successfully',
        class: findClass,
      };
    } else {
      const classes = await this.prisma.class.findMany();
  
      return {
        status: 200,
        message: 'Classes fetched successfully',
        classes: classes,
      };
    }
  }
  

  async updateClass(
    classId: number,
    updateClassDto: UpdateClassDto,
  ): Promise<{ status: number; message: string; class?: any }> {
    const { className } = updateClassDto;
    if (!className) {
      return {
        status: 400,
        message: 'classname is empty',
      };
    }
    const findClass = this.getClasses(classId);
    if ((await findClass).status !== 200) {
      return {
        status: 400,
        message: 'student not found',
      };
    }
    const updatedClass = await this.prisma.class.update({
      where: {
        id: Number(classId),
      },
      data: {
        className,
      },
    });
    return {
      status: 200,
      message: 'class updated successfully',
      class: updatedClass,
    };
  }

  async deleteClass(
    classIds: number[],
  ): Promise<{ status: number; message: string }> {

    const ids = classIds.map(Number).filter(id => !isNaN(id));
    const findClass =await this.prisma.class.findMany({
      where:{
        id: {in : ids}
      }
    });
    if (findClass.length === 0) {
      return { status: 400, message: 'No students found for the provided IDs' };
    }

    await this.prisma.class.deleteMany({
      where: {
        id: {in: ids},
      },
    });
    return {
      status: 200,
      message: `${findClass.length} classes deleted successfully`,
    };
  }
}
