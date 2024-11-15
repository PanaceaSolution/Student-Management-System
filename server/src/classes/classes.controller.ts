import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { ClassService } from './classes.service';
import { CreateClassDto} from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  async findAll() {
    return this.classService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('routineFile'))
  async create(
    @Body() createClassDto: CreateClassDto,
    @UploadedFile() routineFile: Express.Multer.File,
  ) {
    
    if (typeof createClassDto.subjects === 'string') {
      createClassDto.subjects = JSON.parse(createClassDto.subjects);
    }
    
    return this.classService.create({
      ...createClassDto,
      routineFile,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('routineFile'))
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @UploadedFile() routineFile: Express.Multer.File,
  ) {
    
    if (typeof updateClassDto.subjects === 'string') {
      updateClassDto.subjects = JSON.parse(updateClassDto.subjects);
    }

    return this.classService.update(id, {
      ...updateClassDto,
      routineFile,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
