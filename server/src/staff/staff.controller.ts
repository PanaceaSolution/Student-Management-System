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
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
  async create(
    @Body() createStaffDto: CreateStaffDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    // try {
    //   // Parse JSON fields if they are in string format
    //   if (typeof createStaffDto.profile === 'string') {
    //     createStaffDto.profile = JSON.parse(createStaffDto.profile);
    //   }
    //   if (typeof createStaffDto.address === 'string') {
    //     createStaffDto.address = JSON.parse(createStaffDto.address);
    //   }
    //   if (typeof createStaffDto.contact === 'string') {
    //     createStaffDto.contact = JSON.parse(createStaffDto.contact);
    //   }
    // } catch (error) {
    //   throw new BadRequestException(
    //     'Invalid JSON format for address, contact, or profile',
    //   );
    // }

    return this.staffService.createStaff(createStaffDto, files);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
