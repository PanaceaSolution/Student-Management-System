import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { ClassService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import ResponseModel from 'src/utils/utils';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('routineFile'))
  async create(
    @Body() createClassDto: CreateClassDto,
    @UploadedFile() routineFile: Express.Multer.File,
  ) {
    try {


      const classData = await this.classService.create({
        ...createClassDto,
        routineFile,
      });

      return ResponseModel.success('Class created successfully', classData); 
    } catch (error) {
      return ResponseModel.error('Failed to create class', error.message); 
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('routineFile'))
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @UploadedFile() routineFile: Express.Multer.File,
  ) {
    try {
      if (typeof updateClassDto.subjects === 'string') {
        updateClassDto.subjects = JSON.parse(updateClassDto.subjects);
      }

      const updatedClass = await this.classService.update(id, {
        ...updateClassDto,
        routineFile,
      });

      return ResponseModel.success('Class updated successfully', updatedClass);
    } catch (error) {
      return ResponseModel.error('Failed to update class', error.message); 
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.classService.remove(id);
      return ResponseModel.success('Class removed successfully', null); 
    } catch (error) {
      return ResponseModel.error('Failed to remove class', error.message); 
    }
  }

  @Get()
  async findAll() {
    try {
      const classes = await this.classService.findAll();
      return ResponseModel.success('Classes retrieved successfully', classes); 
    } catch (error) {
      return ResponseModel.error('Failed to retrieve classes', error.message); 
  }}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const classData = await this.classService.findOne(id);
      return ResponseModel.success('Class retrieved successfully', classData); 
    } catch (error) {
      return ResponseModel.error('Failed to retrieve class', error.message); 
    }
  }
}