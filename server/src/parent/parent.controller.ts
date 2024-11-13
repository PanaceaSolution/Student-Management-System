import { Controller, Post, Body, Param, Get, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentDto } from './dto/parent.dto';
import { Parent } from './entities/parent.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ])
  )
  async createParent(
    @Body() createParentDto: ParentDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    }
  ) {
    console.log('Request received at /parent/create');
    console.log('Received DTO:', createParentDto);

    // No need for manual parsing due to transformations in ParentDto and RegisterUserDto

    return this.parentService.createParent(createParentDto, files);
  }

  // @Get(':id')
  // async getParentDetails(@Param('id') id: string): Promise<Parent> {
  //   return this.parentService.findOne(id);
  // }
}
