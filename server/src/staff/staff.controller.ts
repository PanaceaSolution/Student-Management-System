import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/staff.dto'; // Ensure the path is correct
import { UpdateStaffDto } from './dto/update-staff.dto'; // Create this DTO for updates

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Create a new staff member
  @Post()
  async create(@Body() data: CreateStaffDto) {

    return this.staffService.createStaff(data);
  }

  // Get all staff members
  @Get()
  async findAll() {
    return this.staffService.getAllStaff();
  }

  // Get a staff member by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const staff = await this.staffService.getStaffById(+id);
    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    return staff;
  }

  // Update a staff member
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateStaffDto) {
    const staff = await this.staffService.getStaffById(+id);
    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    return this.staffService.updateStaff(+id, data);
  }

  // Delete a staff member
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const staff = await this.staffService.getStaffById(+id);
    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    return this.staffService.deleteStaff(+id);
  }
}
