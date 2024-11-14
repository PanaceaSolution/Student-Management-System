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
import * as multer from 'multer';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserAddress,
      UserContact,
      UserProfile, 
      UserDocuments,
      Student
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }), 
    MulterModule.register({
      storage: multer.memoryStorage(), 
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [JwtModule, AuthenticationService, TypeOrmModule],
})
export class AuthenticationModule {}
