import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { AuthenticationModule } from '../user/authentication/authentication.module';
import { User } from '../user/authentication/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, User]),
    AuthenticationModule
  ],
  controllers: [StaffController],
  providers: [StaffService, AuthenticationService],
})
export class StaffModule {}
