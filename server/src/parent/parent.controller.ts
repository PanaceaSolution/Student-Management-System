import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentDto } from './dto/parent.dto';
import { Parent } from './entities/parent.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

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
    return this.parentService.createParent(createParentDto, files);
  }

  @Patch('/update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  async updateParent(
    @Param('id') id: UUID,
    @Body() updateParentDto: Partial<ParentDto>,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    } = {},
  ) {
    try {
      return this.parentService.updateParent(
        id,
        updateParentDto as ParentDto,
        files,
      );
    } catch (error) {
      throw new BadRequestException(
        'Invalid data for updating students. Enter valid data',
      );
    }
  }
}
