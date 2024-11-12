import {
  BadRequestException,
  Injectable,
  Req,
  Res,
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Equal, EqualOperator, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './entities/authentication.entity';
import { ROLE } from '../../utils/role.helper';
import { UserAddress } from '../userEntity/address.entity';
import { UserContact } from '../userEntity/contact.entity';
import { UserDocuments } from '../userEntity/document.entity';
import { UserProfile } from '../userEntity/profile.entity';
import { CloudinaryError, DatabaseError } from '../../utils/custom-errors';


import {
  generateRandomPassword,
  generateUsername,
  encryptdPassword,
  decryptdPassword,
} from '../../utils/utils';
import {  deleteFileFromCloudinary, extractPublicIdFromUrl, uploadFilesToCloudinary} from '../../utils/file-upload.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import * as moment from 'moment';

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
  async register(
    RegisterDto: RegisterUserDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    } = {},
  ) {
    try {
      const { email, role, profile, contact, document, address } = RegisterDto;
  
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
  
      // Generate user credentials
      const password = generateRandomPassword();
      const encryptedPassword = encryptdPassword(password);
      const username = generateUsername(profile.fname, profile.lname, role);
  
      // Create new user
      const newUser = this.userRepository.create({
        email,
        isActivated: true,
        username,
        password: encryptedPassword,
        role: role as ROLE,
        createdAt:new Date(),
      });

      if(newUser.role === 'ADMIN' || newUser.role === 'STUDENT' || newUser.role === 'STAFF' || newUser.role === 'PARENT'){
        throw new ForbiddenException('role not allowed');
      }

  
      try {
        await this.userRepository.save(newUser);
      } catch (error) {
        throw new DatabaseError(
          'Failed to save new user to the database',
          error.message,
        );
      }
  
      let profilePictureUrl: string | null = null;
      if (files.profilePicture && files.profilePicture.length > 0) {
        try {
          const profilePictureUrls = await uploadFilesToCloudinary(
            [files.profilePicture[0].buffer],
            'profile_pictures',
          );
          profilePictureUrl = profilePictureUrls[0];
        } catch (error) {
          throw new CloudinaryError(
            'Failed to upload profile picture',
            error.message,
          );
        }
      }

       // Provide an initializer for the 'dob' variable
      const userProfile = this.profileRepository.create({
        profilePicture: profilePictureUrl,
        fname: profile.fname,
        lname: profile.lname,
        gender: profile.gender,
        dob:new Date(profile.dob),
        user: newUser,
      });
  
      try {
        await this.profileRepository.save(userProfile);
      } catch (error) {
        throw new DatabaseError(
          'Failed to save user profile to the database',
          error.message,
        );
      }
      let savedAddresses = [];
      if (Array.isArray(address)) {
        const userAddresses = address.map((addr) =>
          this.addressRepository.create({
            addressType: addr.addressType,
            wardNumber: addr.wardNumber,
            municipality: addr.municipality,
            province: addr.province,
            district: addr.district,
            user: newUser,
          }),
        );
  
        try {
          savedAddresses = await this.addressRepository.save(userAddresses);
        } catch (error) {
          throw new DatabaseError(
            'Failed to save user addresses to the database',
            error.message,
          );
        }
      }
  

      const userContact = this.contactRepository.create({
        ...contact,
        user: newUser,
      });
  
      try {
        await this.contactRepository.save(userContact);
      } catch (error) {
        throw new DatabaseError(
          'Failed to save user contact to the database',
          error.message,
        );
      }

      let savedDocuments = [];
      if (files.documents && files.documents.length > 0) {
        try {
          const uploadedDocuments = await Promise.all(
            files.documents.map(async (documentFile, index) => {
              const documentUrls = await uploadFilesToCloudinary(
                [documentFile.buffer], 
                'documents',
              );
              const documentUrl = documentUrls[0];
  
              return this.documentRepository.create({
                documentName:
                  document[index]?.documentName || `Document ${index + 1}`,
                documentFile: documentUrl,
                user: newUser,
              });
            }),
          );
          savedDocuments = await this.documentRepository.save(uploadedDocuments);
        } catch (error) {
          throw new CloudinaryError(
            'Failed to upload and save documents',
            error.message,
          );
        }
      }
      return {
        message: 'User created successfully',
        status: 200,
        user: {
          id: newUser.userId,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          isActivated: newUser.isActivated,
          createdAt: newUser.createdAt,
          profile: {
            fname: userProfile.fname,
            lname: userProfile.lname,
            gender: userProfile.gender,
            dob: userProfile.dob,
            profilePicture: userProfile.profilePicture,
          },
          contact: {
            phoneNumber: userContact.phoneNumber,
            alternatePhoneNumber: userContact.alternatePhoneNumber,
            telephoneNumber: userContact.telephoneNumber,
          },
          address: savedAddresses.map((addr) => ({
            addressType: addr.addressType,
            wardNumber: addr.wardNumber,
            municipality: addr.municipality,
            district: addr.district,
            province: addr.province,
          })),
          documents: savedDocuments.map((doc) => ({
            documentName: doc.documentName,
            documentFile: doc.documentFile,
          })),
        },
        plainPassword: password,
      };
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(
          'An unexpected error occurred during registration',
        );
      }
      throw error;
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

  async logout(@Res() res: Response, userId: UUID) {
    try {
      await this.userRepository.update(
        { userId: userId },
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
  async updateUser(
    id: UUID,
    updateData: Partial<RegisterUserDto>,
    files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] } = {}
  ) {
    try {
      const { email, role, profile, contact, document, address } = updateData;
  
      const user = await this.userRepository.findOne({ where: { userId: Equal(id.toString()) } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const updatedFields = {};
  
      if (email !== undefined) {
        const emailInUse = await this.userRepository.findOne({
          where: { email, userId: Not(Equal(id.toString())) },
        });
        if (emailInUse) {
          throw new BadRequestException('This email is already in use by another user');
        }
        user.email = email;
        updatedFields['email'] = email;
      }
  
      if (role !== undefined) {
        user.role = role;
        updatedFields['role'] = role;
      }
      await this.userRepository.save(user);
      console.log('User base data updated:', { email: user.email, role: user.role });
  

      let profilePictureUrl: string | null = null;
      if (profile) {
        profilePictureUrl = await this.handleProfilePictureUpdate(files.profilePicture, user.userId.toString(), updatedFields);
      }
  

      if (profile) {
        await this.updateUserProfile(profile, user.userId.toString(), profilePictureUrl, updatedFields);
      }
  

      if (contact) {
        await this.updateUserContact(contact, user.userId.toString(), updatedFields);
      }

      if (address) {
        await this.updateUserAddress(address, user.userId.toString(), updatedFields);
      }

      if (document) {
        await this.updateUserDocuments(document, files.documents, user.userId.toString(), updatedFields);
      }
  
      const updatedUser = await this.userRepository.findOne({
        where: { userId: Equal(id.toString()) },
        relations: ['profile', 'address', 'contact', 'document'],
      });
  
      return {
        message: 'User updated successfully',
        status: 200,
        user: this.formatUserResponse(updatedUser),
      };
    } catch (error) {
      console.error('Error updating user:', error);
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException('An unexpected error occurred during user update');
      }
      throw error;
    }
  }
  
  private async handleProfilePictureUpdate(
    profilePictureFiles: Express.Multer.File[],
    userId: string,
    updatedFields: Record<string, any>
  ): Promise<string | null> {
    let profilePictureUrl: string | null = null;
  
    if (profilePictureFiles && profilePictureFiles.length > 0) {
      const file = profilePictureFiles[0];
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Profile picture must be an image file');
      }
  
      const userProfile = await this.profileRepository.findOne({ where: { user: Equal(userId) } });
      if (userProfile?.profilePicture) {
        const publicId = extractPublicIdFromUrl(userProfile.profilePicture);
        await deleteFileFromCloudinary(publicId);
        console.log('Old profile picture deleted from Cloudinary');
      }
  
      const [uploadedProfilePicture] = await uploadFilesToCloudinary([file.buffer], 'profile_pictures');
      profilePictureUrl = uploadedProfilePicture;
      updatedFields['profilePicture'] = profilePictureUrl;
    }
  
    return profilePictureUrl;
  }
  
  private async updateUserProfile(profileData, userId: string, profilePictureUrl: string | null, updatedFields: Record<string, any>) {
    const profile = typeof profileData === 'string' ? JSON.parse(profileData) : profileData;
    const userProfile = await this.profileRepository.findOne({ where: { user: Equal(userId) } });
  
    const profileUpdateData = {
      profilePicture: profilePictureUrl ?? userProfile?.profilePicture,
      fname: profile.fname ?? userProfile?.fname,
      lname: profile.lname ?? userProfile?.lname,
      gender: profile.gender ?? userProfile?.gender,
      dob: profile.dob ? new Date(profile.dob) : userProfile?.dob,
    };
  
    await this.profileRepository.update(userProfile.profileId.toString(), profileUpdateData);
    updatedFields['profile'] = profileUpdateData;
    console.log('User profile updated:', profileUpdateData);
  }
  
  private async updateUserContact(contactData, userId: string, updatedFields: Record<string, any>) {
    const contact = typeof contactData === 'string' ? JSON.parse(contactData) : contactData;
    const userContact = await this.contactRepository.findOne({ where: { user: Equal(userId) } });
  
    const contactUpdateData = {
      phoneNumber: contact.phoneNumber ?? userContact?.phoneNumber,
      alternatePhoneNumber: contact.alternatePhoneNumber ?? userContact?.alternatePhoneNumber,
      telephoneNumber: contact.telephoneNumber ?? userContact?.telephoneNumber,
    };
  
    await this.contactRepository.update(userContact.contactId, contactUpdateData);
    updatedFields['contact'] = contactUpdateData;
    console.log('User contact updated:', contactUpdateData);
  }
  
  private async updateUserAddress(addressData, userId: string, updatedFields: Record<string, any>) {
    const addressArray = typeof addressData === 'string' ? JSON.parse(addressData) : addressData;
  
    if (Array.isArray(addressArray) && addressArray.length > 0) {
      await this.addressRepository.delete({ user: Equal(userId) });
      console.log('Old addresses deleted');
  
      const newAddresses = addressArray.map((addr) => this.addressRepository.create({
        addressType: addr.addressType ?? 'default',
        wardNumber: addr.wardNumber ?? 'N/A',
        municipality: addr.municipality ?? 'N/A',
        province: addr.province ?? 'N/A',
        district: addr.district ?? 'N/A',
        user: Object.assign(new User(), { userId }),
      }));
  
      const savedAddresses = await this.addressRepository.save(newAddresses);
      updatedFields['address'] = savedAddresses;
      console.log('New addresses saved:', savedAddresses);
    }
  }
  
  private async updateUserDocuments(documentData, documentFiles: Express.Multer.File[], userId: string, updatedFields: Record<string, any>) {
    const documents = typeof documentData === 'string' ? JSON.parse(documentData) : documentData;
  
    if (Array.isArray(documents) && documents.length > 0) {
      await this.documentRepository.delete({ user: Equal(userId) });
      console.log('Old documents deleted');
  
      const newDocuments = await Promise.all(
        documents.map(async (doc, index) => {
          let documentFileUrl = doc.documentFile;
  
          if (documentFiles && documentFiles[index]) {
            const [uploadedDocumentUrl] = await uploadFilesToCloudinary([documentFiles[index].buffer], 'documents');
            documentFileUrl = uploadedDocumentUrl;
          }
  
          return this.documentRepository.create({
            documentName: doc.documentName ?? `Document ${index + 1}`,
            documentFile: documentFileUrl,
            user: { userId: userId } as unknown as User,
          });
        })
      );
  
      const savedDocuments = await this.documentRepository.save(newDocuments);
      updatedFields['documents'] = savedDocuments;
      console.log('New documents saved:', savedDocuments);
    }
  }
  
  private formatUserResponse(user: User) {
    return {
      id: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
      isActivated: user.isActivated,
      createdAt: user.createdAt,
      profile: {
        fname: user.profile?.fname,
        lname: user.profile?.lname,
        gender: user.profile?.gender,
        dob: user.profile?.dob,
        profilePicture: user.profile?.profilePicture,
      },
      contact: {
        phoneNumber: user.contact?.phoneNumber,
        alternatePhoneNumber: user.contact?.alternatePhoneNumber,
        telephoneNumber: user.contact?.telephoneNumber,
      },
      address: user.address?.map(addr => ({
        addressType: addr.addressType,
        wardNumber: addr.wardNumber,
        municipality: addr.municipality,
        district: addr.district,
        province: addr.province,
      })),
      documents: user.document?.map(doc => ({
        documentName: doc.documentName,
        documentFile: doc.documentFile,
      })),
    };
  }
  
  async getAllUsers(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await this.userRepository.findAndCount({
        order: { createdAt: 'DESC' },
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

  async searchUser(
    searchTerm: string,
    searchBy: 'name' | 'role' | 'email' | 'username',
  ) {
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
          throw new BadRequestException('Invalid search criteria');
      }

      const users = await this.userRepository.find({
        where: whereClause,
        relations: ['profile', 'contact', 'address', 'document'],
      });

      const formattedUsers = users.map((user) => ({
        id: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
        isActivated: user.isActivated,
        createdAt: user.createdAt,
        profile: user.profile
          ? {
              fname: user.profile.fname,
              lname: user.profile.lname,
              gender: user.profile.gender,
              dob: user.profile.dob,
              profilePicture: user.profile.profilePicture,
            }
          : null,
        contact: user.contact
          ? {
              phoneNumber: user.contact.phoneNumber,
              alternatePhoneNumber: user.contact.alternatePhoneNumber,
              telephoneNumber: user.contact.telephoneNumber,
            }
          : null,
        address: user.address
          ? user.address.map((addr) => ({
              addressType: addr.addressType,
              wardNumber: addr.wardNumber,
              municipality: addr.municipality,
              district: addr.district,
              province: addr.province,
            }))
          : [],
        documents: user.document
          ? user.document.map((doc) => ({
              documentName: doc.documentName,
              documentFile: doc.documentFile,
            }))
          : [],
      }));

      return {
        users: formattedUsers,
        status: 200,
        success: true,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (
        error instanceof CloudinaryError ||
        error instanceof DatabaseError
      ) {
        console.error('Database or Cloudinary error:', error);
        throw new InternalServerErrorException(
          'A service error occurred during search',
        );
      } else {
        console.error('Unexpected error during search:', error);
        throw new InternalServerErrorException(
          'An unexpected error occurred during search',
        );
      }
    }
  }

  async deactivateUser(userId: UUID) {
    try {
      const user = await this.userRepository.findOne({ where: { userId } });

      if (!user) {
        return {
          message: 'User not found',
          status: 404,
          success: false,
        };
      }

      user.isActivated = false;
      await this.userRepository.save(user);

      return {
        message: 'User deactivated successfully',
        status: 200,
        success: true,
      };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return {
        message: 'Error deactivating user',
        status: 500,
        success: false,
      };
    }
  }
}
