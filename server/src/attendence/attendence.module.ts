import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import {Attendence} from './entities/attendence.entity'
import { Class } from 'src/classes/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { UserProfile } from 'src/user/userEntity/profile.entity';
import { User } from 'src/user/authentication/entities/authentication.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Attendence, Class,Student, User])],
  controllers: [AttendenceController],
  providers: [AttendenceService ],
})
export class AttendenceModule {}
