import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AssignmentModule } from './assignment/assignment.module';
import { CourseModule } from './course/course.module';
import { FinanceModule } from './finance/finance.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { BillModule } from './bill/bill.module';
import { UploadService } from './uploads/upload.service';
import { CloudinaryProvider } from './uploads/cloudinary.provider';
import { UploadController } from './uploads/upload.controller';
import { StudentModule } from './student/student.module';
import { ParentModule } from './parent/parent.module';
import { StaffModule } from './staff/staff.module';
import { ClassModule } from './classes/classes.module';
import { NoticeModule } from './notice/notice.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [join(process.cwd(), 'dist/**/*.entity{.ts,.js}')], 
        synchronize: true,
        ssl: {
          rejectUnauthorized: false, 
        },
      }),
    }),
    AssignmentModule,
    CourseModule,
    TerminusModule,
    FinanceModule,
    BillModule,
    StudentModule,
    StaffModule,
    ParentModule,
    ClassModule,
    NoticeModule,
  ],
  controllers: [HealthController, UploadController],
  providers: [UploadService, CloudinaryProvider],
})
export class AppModule {}