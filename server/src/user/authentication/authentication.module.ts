import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/authentication.entity';
import { UserAddress } from '../../entities/address.entity';
import { UserContact } from '../../entities/contact.entity';
import { UserProfile } from '../../entities/profile.entity';
import { UserDocuments } from '../../entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAddress,UserContact,UserProfile, UserDocuments]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [JwtModule], // Remove extra closing parenthesis and add missing comma
})
export class AuthenticationModule {}
