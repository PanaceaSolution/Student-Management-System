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
    ]),
  )
  async createParent(
    @Body() createParentDto: ParentDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    try {
      if (typeof createParentDto.profile === 'string') {
        createParentDto.profile = JSON.parse(createParentDto.profile);
      }
      if (typeof createParentDto.address === 'string') {
        createParentDto.address = JSON.parse(createParentDto.address);
      }
      if (typeof createParentDto.contact === 'string') {
        createParentDto.contact = JSON.parse(createParentDto.contact);
      }
        if (typeof createParentDto.document === 'string') {
          createParentDto.document = JSON.parse(createParentDto.document);
        }
    } catch (error) {
      throw new BadRequestException(
        'Invalid JSON format for address, contact, profile, or document',
      );
    }
    return this.parentService.createParent(createParentDto, files);
  }

  // @Get(':id')
  // async getParentDetails(@Param('id') id: string): Promise<Parent> {
  //   return this.parentService.findOne(id);
  // }
}
