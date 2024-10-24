import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaService } from '../DB/prisma.service';
import { PrismaModule } from '../DB/prisma.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PrismaService],
  exports:[JwtModule],
})
export class AuthenticationModule {}
