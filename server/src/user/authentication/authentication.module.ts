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
import { BadRequestError, InternalServerError, UnauthenticatedError, UnauthorizedError } from 'src/utils/custom-errors';
import { NotFoundError } from 'rxjs';
import { StudentModule } from 'src/student/student.module';

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
      RefreshToken,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_LIFETIME },
    }),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    forwardRef(() => StaffModule),
    forwardRef(() => StudentModule), // Add forward reference
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    FullAuthService,
    RefreshTokenUtil,
  ],
  exports: [
    AuthenticationService,
    FullAuthService,
    RefreshTokenUtil,
    JwtModule,
  ],
})
export class AuthenticationModule {}
