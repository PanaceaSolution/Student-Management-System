import {
  BadRequestException,
  Injectable,
  Req,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';

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
import {
  generateRandomPassword,
  generateUsername,
  encryptdPassword,
  decryptdPassword,
} from '../../utils/utils';
import { uploadSingleFileToCloudinary, uploadFilesToCloudinary, deleteFileFromCloudinary } from '../../utils/file-upload.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class AuthenticationService {
  // Removed duplicate uploadMultipleFiles method
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
  async updateProfilePicture(file: Express.Multer.File, oldPublicId?: string): Promise<string> {
    try {
      // Delete the old image if a public ID is provided
      if (oldPublicId) {
        await deleteFileFromCloudinary(oldPublicId);
        console.log("Old profile picture deleted:", oldPublicId);
      }

      // Upload the new profile picture
      const uploadedPicture = await uploadSingleFileToCloudinary(file, 'user_profile_pictures');
      console.log("New profile picture uploaded:", uploadedPicture.secure_url);

      // Return the secure URL of the new profile picture
      return uploadedPicture.secure_url;
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      throw new InternalServerErrorException("Failed to update profile picture");
    }
  }
  async updateMultipleFiles(files: Express.Multer.File[], oldPublicIds?: string[]): Promise<string[]> {
    try {
      // Delete old images if public IDs are provided
      if (oldPublicIds && oldPublicIds.length > 0) {
        await Promise.all(oldPublicIds.map(publicId => deleteFileFromCloudinary(publicId)));
        console.log("Old documents deleted:", oldPublicIds);
      }

      // Upload new files
      const uploadedUrls = await uploadFilesToCloudinary(files, 'user_documents');
      console.log("New documents uploaded:", uploadedUrls);

      // Return secure URLs of the new documents
      return uploadedUrls;
    } catch (error) {
      console.error("Failed to update documents:", error);
      throw new InternalServerErrorException("Failed to update documents");
    }
  }
  async uploadProfilePicture(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    console.log("Uploading profile picture to Cloudinary");

    try {
      const uploadedPicture = await uploadSingleFileToCloudinary(file, 'user_profile_pictures');
      console.log("Profile picture uploaded successfully:", uploadedPicture.secure_url);
      return {
        message: 'Profile picture uploaded successfully',
        secureUrl: uploadedPicture.secure_url,
      };
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      throw new InternalServerErrorException("Failed to upload profile picture to Cloudinary");
    }
  }
  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<any> {
    console.log("Uploading multiple files to Cloudinary");

    try {
      const uploadedFiles = await uploadFilesToCloudinary(files, 'user_documents');
      console.log("Files uploaded successfully:", uploadedFiles);
      return {
        message: 'Files uploaded successfully',
        uploadedFiles,
      };
    } catch (error) {
      console.error("Failed to upload files:", error);
      throw new InternalServerErrorException("Failed to upload files to Cloudinary");
    }
  }

  async register(RegisterDto: RegisterUserDto) {
    try {
      console.log("Register method called");
      console.log("Received Register DTO:", RegisterDto);
  
      const { email, role, profile, contact, document, address } = RegisterDto;
  
      // Check for existing user
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
  
      // Generate random password and encrypted password
      const password = generateRandomPassword();
      const encryptPassword = encryptdPassword(password);
      const username = generateUsername(profile.fname, profile.lname, role);
  
      // Create new user
      const newUser = this.userRepository.create({
        email,
        isActivated: true,
        username,
        password: encryptPassword,
        role: ROLE.ADMIN,
        createdAt: new Date(),
      });
      await this.userRepository.save(newUser);
      console.log("New user created:", newUser);
  
      // Handle profile picture: check if it's a URL or file
      let profilePictureUrl = null;
      if (profile.profilePicture && typeof profile.profilePicture === 'string') {
        // If profilePicture is a URL, use it directly
        profilePictureUrl = profile.profilePicture;
      } else if (profile.profilePicture && typeof profile.profilePicture !== 'string') {
        // If it's a file, upload to Cloudinary
        console.log("Uploading profile picture to Cloudinary");
        try {
          const uploadedPicture = await uploadSingleFileToCloudinary(
            profile.profilePicture as Express.Multer.File,
            'user_profile_pictures'
          );
          profilePictureUrl = uploadedPicture.secure_url;
        } catch (error) {
          console.error("Failed to upload profile picture:", error);
          throw new InternalServerErrorException("Failed to upload profile picture to Cloudinary");
        }
      }
  
      // Save user profile
      const userProfile = this.profileRepository.create({
        profilePicture: profilePictureUrl || '',
        fname: profile.fname,
        lname: profile.lname,
        gender: profile.gender,
        dob: new Date(profile.dob),
        user: newUser,
      });
      await this.profileRepository.save(userProfile);
      console.log("User profile saved:", userProfile);
  
      // Save user address
      if (Array.isArray(address) && address.length > 0) {
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
        console.log("User address saved:", userAddress);
      }
  
      // Save user contact
      const userContact = this.contactRepository.create({
        ...contact,
        user: newUser,
      });
      await this.contactRepository.save(userContact);
      console.log("User contact saved:", userContact);
  
      // Handle document uploads: Check if `documentFile` is a URL or file
      let documentUrls = [];
      if (Array.isArray(document) && document.length > 0) {
        for (const doc of document) {
          let documentFileUrl = doc.documentFile;
  
          if (doc.documentFile && typeof doc.documentFile !== 'string') {
            // If it's a file, upload to Cloudinary
            console.log("Uploading document to Cloudinary");
            try {
              const uploadedDocument = await uploadSingleFileToCloudinary(
                doc.documentFile as Express.Multer.File,
                'user_documents'
              );
              documentFileUrl = uploadedDocument.secure_url;
            } catch (error) {
              console.error(`Failed to upload document (${doc.documentName}):`, error);
              throw new InternalServerErrorException(`Failed to upload document ${doc.documentName} to Cloudinary`);
            }
          }
  
          documentUrls.push({
            documentName: doc.documentName,
            documentFile: documentFileUrl,
            user: newUser,
          });
        }
      }
  
      // Save user documents
      if (documentUrls.length > 0) {
        const userDocuments = documentUrls.map((docData) => this.documentRepository.create(docData));
        await this.documentRepository.save(userDocuments.flat());
        console.log("User documents saved:", userDocuments);
      }
  
      // Success response
      console.log("User registration successful");
      return {
        message: 'User created successfully',
        status: 200,
        user: newUser,
        plainPassword: password,
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An unexpected error occurred during registration');
      }
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
        return {
          message: 'Password cannot be updated',
          status: 403,
          success: false,
        };
      }
  
      await this.userRepository.save(user);
  
      // Update Profile
      if (profile) {
        const userProfile = await this.profileRepository.findOne({ where: { user: Equal(user.userId) } });
        let profilePictureUrl = profile.profilePicture;
  
        // Upload new profile picture if provided as a file
        if (profile.profilePicture && typeof profile.profilePicture !== 'string') {
          const uploadedPicture = await uploadSingleFileToCloudinary(
            profile.profilePicture as Express.Multer.File,
            'user_profile_pictures'
          );
          profilePictureUrl = uploadedPicture.secure_url;
        }
  
        if (userProfile) {
          await this.profileRepository.update(userProfile.profileId.toString(), {
            profilePicture: typeof profilePictureUrl === 'string' ? profilePictureUrl : userProfile.profilePicture,
            fname: profile.fname ?? userProfile.fname,
            lname: profile.lname ?? userProfile.lname,
            gender: profile.gender ?? userProfile.gender,
            dob: profile.dob ? new Date(profile.dob) : userProfile.dob,
          });
        } else {
          const newUserProfile = this.profileRepository.create({
            profilePicture: typeof profilePictureUrl === 'string' ? profilePictureUrl : '',
            fname: profile.fname,
            lname: profile.lname,
            gender: profile.gender,
            dob: profile.dob ? new Date(profile.dob) : undefined,
            user,
          });
          await this.profileRepository.save(newUserProfile);
        }
      }
  
      // Update Address
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
          })
        );
        await this.addressRepository.save(newAddresses);
      }
  
      // Update Contact
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
        }
      }
  
      // Update Documents
      if (Array.isArray(document) && document.length > 0) {
        await this.documentRepository.delete({ user: Equal(user.userId) });
  
        const documentUrls = [];
        for (const doc of document) {
          let documentFileUrl = doc.documentFile;
  
          // Upload document file if provided as a file
          if (doc.documentFile && typeof doc.documentFile !== 'string') {
            const uploadedDocument = await uploadSingleFileToCloudinary(
              doc.documentFile as Express.Multer.File,
              'user_documents'
            );
            documentFileUrl = uploadedDocument.secure_url;
          }
  
          documentUrls.push({
            documentName: doc.documentName ?? 'Unnamed Document',
            documentFile: documentFileUrl,
            user,
          });
        }
  
        const newDocuments = documentUrls.map((docData) => this.documentRepository.create(docData));
        await this.documentRepository.save(newDocuments.flat());
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