import { Module, RequestMethod, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
// import { AuthMiddleware } from '../auth.middleware';
import { AuthenticationModule } from '../user/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from '../user/authentication/entities/authentication.entity';
import { Class } from 'src/classes/entities/class.entity';
import { UserProfile } from 'src/user/userEntity/profile.entity';
import { ParentModule } from 'src/parent/parent.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      User,
      Class,
      UserProfile,
    ]),
    forwardRef(() => AuthenticationModule), // Add forward reference
    ParentModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService, TypeOrmModule], // Export StudentService
})
export class StudentModule {}
