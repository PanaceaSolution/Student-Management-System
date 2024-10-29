import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAddress } from '../../common/address.entity';
import { UserProfile } from '../../common/profile.entity';
import { UserDocuments } from '../../common/document.entity';
import { UserContact } from '../../common/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserAddress,
      UserProfile,
      UserDocuments,
      UserContact,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [JwtModule, AuthenticationService, TypeOrmModule],
})
export class AuthenticationModule {}
