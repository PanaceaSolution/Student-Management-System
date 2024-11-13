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
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDto } from './dto/staff.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  async createStaff(
    @Body() createStaffDto: any,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    console.log('Received files:', files);
    console.log('Received body:', createStaffDto);

    try {
      if (typeof createStaffDto.profile === 'string') {
        createStaffDto.profile = JSON.parse(createStaffDto.profile);
      }
      if (typeof createStaffDto.address === 'string') {
        createStaffDto.address = JSON.parse(createStaffDto.address);
      }
      if (typeof createStaffDto.contact === 'string') {
        createStaffDto.contact = JSON.parse(createStaffDto.contact);
      }
      if (typeof createStaffDto.document === 'string') {
        createStaffDto.document = JSON.parse(createStaffDto.document);
      }
    } catch (error) {
      throw new BadRequestException(
        'Invalid JSON format for address, contact, profile, or document',
      );
    }

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

  @Get('all-staff')
  async getStaffs(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page) || 1; 
    const pageSize = parseInt(limit) || 8; 
    return this.staffService.getAllStaff(pageNumber, pageSize);
  }

  @Get(':id')
  async getStaffById(@Param('id') id: string) {
    return this.staffService.findStaffById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
