import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
// import { AuthMiddleware } from '../auth.middleware';
import { AuthenticationModule } from '../user/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from '../user/authentication/entities/authentication.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      User,
    ]),
    AuthenticationModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [TypeOrmModule.forFeature([Student])] 
})
export class StudentModule {
}