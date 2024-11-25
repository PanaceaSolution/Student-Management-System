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

  //   @Post('create')
  //   async createAttendence(@Body() createAttendenceDto: CreateAttendanceDto) {
  //     return this.attendenceService.createAttendence(createAttendenceDto);
  //   }
}
