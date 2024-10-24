import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaModule } from '../DB/prisma.module';
import { CloudinaryProvider } from '../uploads/cloudinary.provider';

@Module({
  imports: [PrismaModule, CloudinaryProvider],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
