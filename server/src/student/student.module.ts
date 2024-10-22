import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaModule } from '../DB/prisma.module';
import { AuthMiddleware } from '../auth.middleware';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [PrismaModule,AuthenticationModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {

  configure(consumer:MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'student/create',
        method: RequestMethod.POST,
      },
      {
        path: 'student/update/:studentId',
        method:RequestMethod.PUT,
      },
    );
  }
}
