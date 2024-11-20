import { Module, forwardRef } from '@nestjs/common';
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
import { Staff } from 'src/staff/entities/staff.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { RefreshToken } from '../userEntity/refresh-token.entity'; // Import RefreshToken entity
import { StaffModule } from 'src/staff/staff.module';
import { FullAuthService } from '../../middlewares/full-auth.service';
import { RefreshTokenUtil } from '../../middlewares/refresh-token.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserAddress,
      UserContact,
      UserProfile,
      UserDocuments,
      Student,
      Staff,
      Parent,
      RefreshToken, // Register the RefreshToken entity in TypeORM
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // JWT secret from environment variables
      signOptions: { expiresIn: process.env.JWT_LIFETIME }, // Token expiration from environment variables
    }),
    MulterModule.register({
      storage: multer.memoryStorage(), // Configure in-memory storage for Multer
    }),
    forwardRef(() => StaffModule), // Forward reference to StaffModule for dependency resolution
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService, // Core service for authentication logic
    FullAuthService, // Service for handling tokens and cookies
    RefreshTokenUtil, // Utility for handling token refresh logic
  ],
  exports: [
    AuthenticationService, // Allow other modules to use the authentication service
    FullAuthService, // Allow other modules to use the full auth service
    RefreshTokenUtil, // Export the RefreshTokenUtil for use elsewhere
    JwtModule, // Export the JWT module for token-related functionalities
  ],
})
export class AuthenticationModule {}
