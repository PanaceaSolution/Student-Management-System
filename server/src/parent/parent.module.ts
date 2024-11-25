import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { Parent } from './entities/parent.entity';
import { User } from '../user/authentication/entities/authentication.entity';
import { Student } from '../student/entities/student.entity'; // If needed for student-parent relation
import { AuthenticationModule } from 'src/user/authentication/authentication.module';
import ResponseModel from 'src/utils/utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parent,
      User,
      Student, // Include Student if Parent has a relation with Student
    ]),
    AuthenticationModule,
    ResponseModel

  ],
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService], 
})
export class ParentModule {}
