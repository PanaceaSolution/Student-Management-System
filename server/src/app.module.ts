import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './DB/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffModule } from './staff/staff.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ParentModule } from './parent/parent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    StaffModule,
    AuthenticationModule,,
    ParentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
