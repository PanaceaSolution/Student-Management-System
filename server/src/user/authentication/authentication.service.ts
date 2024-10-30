import { Injectable, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './entities/authentication.entity';
import { ROLE } from '../../utils/role.helper';

import { UserAddress } from '../../entities/address.entity';
import { UserContact } from '../../entities/contact.entity';
import { UserDocuments } from '../../entities/document.entity';
import { UserProfile } from '../../entities/profile.entity';

import {
  generateRandomPassword,
  generateUsername,
  encryptdPassword,
  decryptdPassword,
} from '../../utils/utils';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserAddress)
    private readonly addressRepository: Repository<UserAddress>,
    @InjectRepository(UserContact)
    private readonly contactRepository: Repository<UserContact>,
    @InjectRepository(UserDocuments)
    private readonly documentRepository: Repository<UserDocuments>,
    private jwtService: JwtService,
  ) {}
  async register(RegisterDto: RegisterUserDto) {
    try {
      const { email, role, profile, contact, document, address } = RegisterDto;
      const ExistingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (ExistingUser) {
        return {
          message: 'User already exist,',
          status: 409,
          success: false,
        };
      }

      if (role !== ROLE.ADMIN) {
        return {
          message: 'Only Admin can register',
          status: 403,
          success: false,
        };
      }
      const UserCount = await this.userRepository.count({
        where: {
          role: ROLE.ADMIN,
        },
      });
      if (UserCount >= 100) {
        return {
          message: "You can't create user more than 1",
          status: 403,
          success: false,
        };
      }
      const password = generateRandomPassword();
      const encryptPassword = encryptdPassword(password);
      const username = generateUsername(profile.fname, profile.lname, role);
      const newUser = await this.userRepository.create({
        email,
        isActivated: true,
        username,
        password: encryptPassword,
        role: ROLE.ADMIN,
      });

      await this.userRepository.save(newUser);
      //profile
      const userProfile = this.profileRepository.create({
        profilePicture: profile.profilePicture,
        fname: profile.fname,
        lname: profile.lname,
        gender: profile.gender,
        dob: new Date(profile.dob),
        user: newUser,
      });
      await this.profileRepository.save(userProfile);
      // user address
      if (Array.isArray(address)) {
        const userAddress = address.map((addr) => {
          return this.addressRepository.create({
            addressType: addr.addressType,
            wardNumber: addr.wardNumber,
            municipality: addr.municipality,
            province: addr.province,
            district: addr.district,
            user: newUser,
          });
        });
        await this.addressRepository.save(userAddress);
      }

      // user contact
      const userContact = this.contactRepository.create({
        ...contact,
        user: newUser,
      });
      await this.contactRepository.save(userContact);

      //documents
      if (Array.isArray(document)) {
        const userDocuments = document.map((doc) => {
          return this.documentRepository.create({
            documentName: doc.documentName,
            documentFile: doc.documentFile,
            user: newUser, // Associate the document with the user
          });
        });
        await this.documentRepository.save(userDocuments);
      }
      return {
        message: 'user created successfully',
        status: 200,
        user: newUser,
        plainPassword: password,
      };
    } catch (error) {
      return {
        message: `${error} and error occurs`,
        status: 500,
      };
    }
  }

  async login(loginDto: LoginDto, @Res() res: Response) {
    try {
      const { username, password } = loginDto;
      if (!username || !password) {
        return res.status(401).json({
          message: 'Please fill both username and password',
          success: false,
        });
      }
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          success: false,
        });
      }
      const decryptedPassword = decryptdPassword(user.password);
      let isPasswordValid = false;
      if (user) {
        isPasswordValid = password === decryptedPassword;
      }

      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid password',
          success: false,
        });
      }

      // Only set the cookie if all validations pass
      const payload = { username: user.username, role: user.role };
      const AccessToken = this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET, // short lifespan for access token
      });

      const RefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      });
      res.cookie('accessToken', AccessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', RefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      await this.userRepository.update(
        { username: user.username }, // Use the correct syntax for the 'where' argument
        { refreshToken: RefreshToken },
      );

      return res.status(200).json({ payload, success: true });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  }
  async logout(@Res() res: Response, userId: UUID): Promise<void> {
    try {
      await this.userRepository.update(
        { userId: userId }, // Use the correct syntax for the 'where' argument
        { refreshToken: null },
      );
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(200).json({
        message: 'Logout successful',
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  }

  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({
        message: 'No refresh token is provided',
        success: false,
      });
    }

    try {
      const decoded = this.jwtService.verify(refreshToken);

      const payload = {
        username: decoded.username,
        role: decoded.role,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      return res.status(200).json({
        message: 'New access token generated',
        success: true,
      });
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid refresh token',
        success: false,
      });
    }
  }
}
