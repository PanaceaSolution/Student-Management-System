import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/attendence.dto';

@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

    @Post('save')
    async saveAttendence(@Body() createAttendenceDto: CreateAttendanceDto[]) {
      return this.attendenceService.saveAttendence(createAttendenceDto);
    }
}
