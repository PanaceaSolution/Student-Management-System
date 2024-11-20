import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import {Attendence} from './entities/attendence.entity'
import { Class } from 'src/classes/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Attendence, Class,Student])],
  controllers: [AttendenceController],
  providers: [AttendenceService ],
})
export class AttendenceModule {}
