import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import {Attendence} from './entities/attendence.entity'
import { Class } from 'src/classes/entities/class.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Attendence, Class])],
  controllers: [AttendenceController],
  providers: [AttendenceService ],
})
export class AttendenceModule {}
