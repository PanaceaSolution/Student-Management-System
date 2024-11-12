import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClassService } from './classes.service';
import { CreateClassDto} from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

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
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
