import { Body, Controller, Get, Param, Post,Query } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/attendence.dto';

@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post('/save')
  async saveAttendence(@Body() createAttendenceDto: CreateAttendanceDto) {
    return this.attendenceService.saveAttendence(createAttendenceDto);
  }

  @Get(':className/:section/generate')
  async generateAttendence( @Param('className') className: string,
    @Param('section') section: string,) {
    return this.attendenceService.generateAttendence(className, section);
  }
}
