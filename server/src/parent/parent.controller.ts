import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentDto } from './dto/parent.dto';
import { Parent } from './entities/parent.entity';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post('/create')
  async createParent(@Body() createParentDto: ParentDto) {
    return this.parentService.createParent(createParentDto);
  }

  @Get(':id')
  async getParentDetails(@Param('id') id: string): Promise<Parent> {
    return this.parentService.findOne(id);
  }
}
