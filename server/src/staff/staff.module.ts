import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { AuthenticationModule } from '../user/authentication/authentication.module';
import { User } from '../user/authentication/entities/authentication.entity';
import { UserProfile } from '../user/userEntity/profile.entity';
import { UserAddress } from '../user/userEntity/address.entity';
import { UserContact } from '../user/userEntity/contact.entity';
import { UserDocuments } from '../user/userEntity/document.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, User,UserProfile,UserAddress,UserContact,UserDocuments]),
    AuthenticationModule
  ],
  controllers: [StaffController],
  providers: [StaffService, AuthenticationService],
})
export class StaffModule {}
