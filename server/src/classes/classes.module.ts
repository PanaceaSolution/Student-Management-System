import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassService } from './classes.service';
import { ClassController } from './classes.controller';
import { Class } from './entities/class.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Course } from '../course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Staff, Course])],
  providers: [ClassService],
  controllers: [ClassController],
})
export class ClassModule {}
