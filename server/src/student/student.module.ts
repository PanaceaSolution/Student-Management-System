import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
// import { AuthMiddleware } from '../auth.middleware';
import { AuthenticationModule } from '../user/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentAddress } from './entities/studentAddress.entity';
import { StudentContact } from './entities/studentContact.entity';
import { User } from '../user/authentication/entities/authentication.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentAddress, StudentContact, User]),
    AuthenticationModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes(
  //     {
  //       path: 'student/create',
  //       method: RequestMethod.POST,
  //     },
  //     {
  //       path: 'student/update/:studentId',
  //       method: RequestMethod.PUT,
  //     },
  //   );
  // }
}
