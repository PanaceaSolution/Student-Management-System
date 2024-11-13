import { Controller, Post, Body, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentDto } from './dto/parent.dto';
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
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    console.log("Request received at /parent/create");
  
    try {
      console.log("Before Parsing:", createParentDto);
  
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
      if (typeof createParentDto.childNames === 'string') {
        createParentDto.childNames = JSON.parse(createParentDto.childNames);
      }
  
      console.log("After Parsing:", createParentDto);
    } catch (error) {
      console.error("Parsing Error:", error);
      throw new BadRequestException(
        'Invalid JSON format for address, contact, profile, document, or childNames',
      );
    }
  
    return this.parentService.createParent(createParentDto, files);
  }
}

// @Get(':id')
// async getParentDetails(@Param('id') id: string): Promise<Parent> {
//   return this.parentService.findOne(id);
// }