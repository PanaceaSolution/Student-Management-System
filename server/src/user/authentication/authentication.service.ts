import { Injectable, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Equal, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './entities/authentication.entity';
import { ROLE } from '../../utils/role.helper';
import { UserAddress } from '../userEntity/address.entity';
import { UserContact } from '../userEntity/contact.entity';
import { UserDocuments } from '../userEntity/document.entity';
import { UserProfile } from '../userEntity/profile.entity';
import { generateRandomPassword, generateUsername, encryptdPassword, decryptdPassword } from '../../utils/utils';
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

      // if (role !== ROLE.ADMIN) {
      //   return {
      //     message: 'Only Admin can register',
      //     status: 403,
      //     success: false,
      //   };
      // }
      // const UserCount = await this.userRepository.count({
      //   where: {
      //     role: ROLE.ADMIN,
      //   },
      // });
      // if (UserCount >= 100) {
      //   return {
      //     message: "You can't create user more than 1",
      //     status: 403,
      //     success: false,
      //   };
      // }
      const password = generateRandomPassword();
      const encryptPassword = encryptdPassword(password);
      const username = generateUsername(profile.fname, profile.lname, role);
      const newUser = await this.userRepository.create({
        email,
        isActivated: true,
        username,
        password: encryptPassword,
        role: ROLE.ADMIN,
        createdAt: new Date(),
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

  async logout(@Res() res: Response, userId: UUID) {
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
  async updateUser(id: UUID, updateData: Partial<RegisterUserDto>) {
    try {
      const { email, role, profile, contact, document, address } = updateData;
  
      const user = await this.userRepository.findOne({ where: { userId: Equal(id) } });
      if (!user) {
        return {
          message: 'User not found',
          status: 404,
          success: false,
        };
      }
  
      if (updateData.username) {
        return {
          message: 'Username cannot be updated',
          status: 403,
          success: false,
        };
      }
  

      if (email !== undefined) user.email = email;
      if (role !== undefined) user.role = role;
      if (updateData.password) {
        return{
          message: 'Password cannot be updated',
          status: 403,
          success: false,
        };
      }
  
      await this.userRepository.save(user);
  
      if (profile) {
        const userProfile = await this.profileRepository.findOne({ where: { user: Equal(user.userId) } });
        if (userProfile) {
          await this.profileRepository.update(userProfile.profileId.toString(), {
            profilePicture: profile.profilePicture ?? userProfile.profilePicture,
            fname: profile.fname ?? userProfile.fname,
            lname: profile.lname ?? userProfile.lname,
            gender: profile.gender ?? userProfile.gender,
            dob: profile.dob ? new Date(profile.dob) : userProfile.dob,
          });
        } else {
          const newUserProfile = this.profileRepository.create({
            profilePicture: profile.profilePicture,
            fname: profile.fname,
            lname: profile.lname,
            gender: profile.gender,
            dob: profile.dob ? new Date(profile.dob) : undefined,
            user,
          });
          await this.profileRepository.save(newUserProfile);
        }
      }
  
      if (Array.isArray(address) && address.length > 0) {
        await this.addressRepository.delete({ user: Equal(user.userId) });
        const newAddresses = address.map((addr) =>
          this.addressRepository.create({
            addressType: addr.addressType ?? 'default',
            wardNumber: addr.wardNumber ?? 'N/A',
            municipality: addr.municipality ?? 'N/A',
            province: addr.province ?? 'N/A',
            district: addr.district ?? 'N/A',
            user,
          }),
        );
        await this.addressRepository.save(newAddresses);
      }

      if (contact) {
        let userContact = await this.contactRepository.findOne({ where: { user: Equal(user.userId) } });
        if (userContact) {
          await this.contactRepository.update(userContact.contactId, {
            phoneNumber: contact.phoneNumber ?? userContact.phoneNumber,
            alternatePhoneNumber: contact.alternatePhoneNumber ?? userContact.alternatePhoneNumber,
            telephoneNumber: contact.telephoneNumber ?? userContact.telephoneNumber,
          });
        } else {
          userContact = this.contactRepository.create({ ...contact, user });
          await this.contactRepository.save(userContact);
          await this.contactRepository.save(userContact);
        }
      }
      if (Array.isArray(document) && document.length > 0) {
        await this.documentRepository.delete({ user: Equal(user.userId) });
        const newDocuments = document.map((doc) =>
          this.documentRepository.create({
            documentName: doc.documentName ?? 'Unnamed Document',
            documentFile: doc.documentFile ?? '',
            user,
          }),
        );
        await this.documentRepository.save(newDocuments);
      }

      const updatedUser = await this.userRepository.findOne({
        where: { userId: Equal(id) },
        relations: ['profile', 'address', 'contact', 'document'],
      });
  
      return {
        message: 'User updated successfully',
        status: 200,
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        message: 'Error updating user',
        status: 500,
        success: false,
      };
    }
  }

  async getAllUsers(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
  
      const [users, total] = await this.userRepository.findAndCount({
        // order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
  
      return {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        status: 200,
        success: true,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        message: 'Error fetching users',
        status: 500,
        success: false,
        error: error.message,
      };
    }
  }
  async searchUser(searchTerm: string, searchBy: 'name' | 'role' | 'email' | 'username') {
    try {
      let whereClause;

      switch (searchBy) {
        case 'name':
          whereClause = [
            { profile: { fname: Like(`${searchTerm}%`) } },
            { profile: { lname: Like(`${searchTerm}%`) } },
          ];
          break;

        case 'role':
          whereClause = { role: searchTerm as ROLE };
          break;

        case 'email':
          whereClause = { email: Like(`%${searchTerm}%`) };
          break;

        case 'username':
          whereClause = { username: Like(`${searchTerm}%`) };
          break;

        default:
          return {
            message: 'Invalid search criteria',
            status: 400,
            success: false,
          };
      }

      const users = await this.userRepository.find({
        where: whereClause,
        relations: searchBy === 'name' ? ['profile'] : [],
      });

      return {
        users,
        status: 200,
        success: true,
      };
    } catch (error) {
      console.error('Error during search:', error);
      return {
        message: 'Error during search',
        status: 500,
        success: false,
      };
    }
  }

}