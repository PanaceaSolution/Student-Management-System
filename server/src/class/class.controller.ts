import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { ClassService } from './class.service';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('/create')
  async createClass(
    @Body() createClassDto: CreateClassDto
  ): Promise<{
    status: number;
    message: string;
    parent?: any;
    login?: any;
  }> {
    return this.classService.createClass(createClassDto);
  }

  @Get('/get-class/:classId?')
  async getClasses(
    @Param('classId') classId?: number, 
  ): Promise<{
    status: number;
    message: string;
    class?: any;
    classes?: any[];
  }> {
    const id = classId ? Number(classId) : undefined;

    return this.classService.getClasses(id);
  }

  @Put('/update/:classId')
  async updateClass(
    @Param('classId') classId: number,
    @Body() updateClassDto: UpdateClassDto
  ): Promise<{status: number; message: string; class? : any}>{
    return this.classService.updateClass(
      classId,
      updateClassDto
    )
  }

  @Delete('/delete')
  async deleteClass(
    @Body('classIds') classIds: number[] 
  ): Promise<{status: number; message: string;}>{
    return this.classService.deleteClass(classIds)
  }
}
