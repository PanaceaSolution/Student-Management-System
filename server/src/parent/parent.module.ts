import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { Parent } from './entities/parent.entity';
import { User } from '../user/authentication/entities/authentication.entity';
import { Student } from '../student/entities/student.entity';
import { AuthenticationModule } from '../user/authentication/authentication.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parent,
      User,
      Student, 
    ]),
    AuthenticationModule,
  ],
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService], 
})
export class ParentModule {}
