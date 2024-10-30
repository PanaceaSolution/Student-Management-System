import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('create')
  async create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
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
