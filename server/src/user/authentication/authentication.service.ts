import { Injectable, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto, LoginUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { generateRandomPassword, generateUsername } from '../../utils/utils';
import { UserAddress } from '../userEntity/address.entity';
import { UserProfile } from '../userEntity/profile.entity';
import { UserContact } from '../userEntity/contact.entity';
import { UserDocuments } from '../userEntity/document.entity';

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
      const { email, role, profile, address, contact, document } = RegisterDto;

      if (!role || !email) {
        return {
          message: 'You must have to fill all the above fields',
          status: 500,
          success: false,
        };
      }

      const ExistingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (ExistingUser) {
        return {
          message: 'User already exist',
          status: 409,
          success: false,
        };
      }

      const password = generateRandomPassword();
      const username = generateUsername(profile.fname, profile.lname, role);

      const newUser = this.userRepository.create({
        email,
        role,
        isActivated: true,
        password: password,
        username: username,
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

      //address
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

      //contact
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
            user: newUser,
          });
        });

        // Save all user documents
        await this.documentRepository.save(userDocuments);
      }

      return {
        message: 'user created successfully',
        status: 200,
        user: newUser,
      };
    } catch (error) {
      return {
        message: `${error} and error occurs`,
        status: 500,
      };
    }
  }

  async login(loginDto: LoginUserDto, @Res() res: Response) {
    const { username, password } = loginDto;

    try {
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
      // let isPasswordValid = false;
      // if (user.role === ROLE.ADMIN) {
      //   isPasswordValid = await bcrypt.compare(password, user.password);
      // } else if (user.role === ROLE.STUDENT) {
      //   isPasswordValid = password === user.password;
      // }

      // if (!isPasswordValid) {
      //   return res.status(401).json({
      //     message: 'Invalid password',
      //     success: false,
      //   });
      // }
      const payload = { username: user.username, role: user.role };
      const AccessToken = this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET, 
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
        { username: user.username }, 
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
//csrf token
//session management
//sql injection
//xss
//brute force attack
//rate limiting
//strick limiter