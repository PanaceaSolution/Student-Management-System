import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDto } from './dto/staff.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';


@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  async createStaff(
    @Body() createStaffDto: StaffDto,
    @UploadedFiles()
    files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] }
  ) {
    console.log('Received files:', files);
    console.log('Received DTO:', createStaffDto);

    return this.staffService.createStaff(createStaffDto, files);
  }
  
  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  async updateStaff(
    @Param('id') id:UUID,
    @Body() updateStaffDto: Partial<StaffDto>,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    return this.staffService.updateStaff(id, updateStaffDto, files);
  }



  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
