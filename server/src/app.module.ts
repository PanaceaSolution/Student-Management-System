import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './DB/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { ClassModule } from './class/class.module';
import { FeeModule } from './fee/fee.module';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    StudentModule,
    ClassModule,
    FeeModule
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryProvider],
})
export class AppModule {}
