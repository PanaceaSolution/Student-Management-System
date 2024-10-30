import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/authentication.entity';
import { UserAddress } from '../userEntity/address.entity';
import { UserContact } from '../userEntity/contact.entity';
import { UserProfile } from '../userEntity/profile.entity';
import { UserDocuments } from '../userEntity/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserAddress,
      UserContact,
      UserProfile,
      UserDocuments,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MulterModule.register({ dest: './uploads' }), // Explicitly configure Multer
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [JwtModule, AuthenticationService, TypeOrmModule],
})
export class AuthenticationModule {}
