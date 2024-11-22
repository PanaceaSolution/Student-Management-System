import {
  BadRequestException,
  Injectable,
  Req,
  Res,
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { Equal, ILike, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './entities/authentication.entity';
import { ROLE } from '../../utils/role.helper';
import { UserAddress } from '../userEntity/address.entity';
import { UserContact } from '../userEntity/contact.entity';
import { UserDocuments } from '../userEntity/document.entity';
import { StaffService } from 'src/staff/staff.service';
import { UserProfile } from '../userEntity/profile.entity';
import { CloudinaryError, DatabaseError } from '../../utils/custom-errors';
import {
  generateRandomPassword,
  generateUsername,
  encryptdPassword,
  decryptdPassword,
} from '../../utils/utils';
import { RefreshTokenUtil } from 'src/middlewares/refresh-token.util';
import {
  deleteFileFromCloudinary,
  extractPublicIdFromUrl,
  uploadFilesToCloudinary,
} from '../../utils/file-upload.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import * as moment from 'moment';
import { v2 as Cloudinary } from 'cloudinary';
import { STAFFROLE } from '../../utils/role.helper';
import { Student } from 'src/student/entities/student.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { FullAuthService } from 'src/middlewares/full-auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  findUserByEmail(email: string) {
    throw new Error('Method not implemented.');
  }
  generateRandomPassword() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserAddress)
    private readonly addressRepository: Repository<UserAddress>,
    @InjectRepository(UserContact)
    private readonly contactRepository: Repository<UserContact>,
    @InjectRepository(UserDocuments)
    private readonly documentRepository: Repository<UserDocuments>,
    private readonly staffService: StaffService,
    private readonly fullAuthService: FullAuthService,
    private readonly refreshTokenUtil: RefreshTokenUtil,
    private readonly jwtService: JwtService,
  ) { }
  async register(
    RegisterDto: RegisterUserDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    } = {},
    staffRole?: STAFFROLE,
  ) {
    try {
      const { email, role, profile, contact, document, address } = RegisterDto;

      if (!email || !role || !profile || !contact || !document || !address) {
        throw new BadRequestException('All fields are required');
      }

      if (![ROLE.ADMIN, ROLE.STUDENT, ROLE.STAFF, ROLE.PARENT].includes(role)) {
        throw new ForbiddenException('Role not allowed');
      }

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const password = generateRandomPassword();
      const encryptedPassword = encryptdPassword(password);
      const username = generateUsername(
        profile.fname,
        profile.lname,
        role,
        staffRole,
      );


      const newUser = this.userRepository.create({
        email,
        isActivated: true,
        username,
        password: encryptedPassword,
        role,
        createdAt: new Date(),
      });

      await this.userRepository.save(newUser);

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

      const userProfile = this.profileRepository.create({
        profilePicture: profilePictureUrl,
        fname: profile.fname,
        lname: profile.lname,
        gender: profile.gender,
        dob: new Date(profile.dob).toISOString().split('T')[0],
        user: newUser,
      });

      await this.profileRepository.save(userProfile);

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

        savedAddresses = await this.addressRepository.save(userAddresses);
      }

      const userContact = this.contactRepository.create({
        ...contact,
        user: newUser,
      });

      await this.contactRepository.save(userContact);

      let savedDocuments = [];
      if (files.documents && files.documents.length > 0) {
        const documentMetadata = document;

        const uploadedDocuments = await Promise.all(
          files.documents.map(async (documentFile, index) => {
            const documentUrls = await uploadFilesToCloudinary(
              [documentFile.buffer],
              'documents',
            );
            const documentUrl = documentUrls[0];

            const documentName =
              documentMetadata[index]?.documentName || `Document ${index + 1}`;

            return this.documentRepository.create({
              documentName,
              documentFile: documentUrl,
              user: newUser,
            });
          }),
        );

        savedDocuments = await this.documentRepository.save(uploadedDocuments);
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

  async login(loginDto: LoginDto, res: Response) {
    try {
      const { username, password, deviceInfo } = loginDto;
  
      if (!username || !password) {
        throw new BadRequestException('Username and password are required');
      }
  

      const user = await this.userRepository.findOne({
        where: { username },
        relations: ['profile'],
      });
  
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
  
      if (!user.isActivated) {
        throw new UnauthorizedException('Account is deactivated');
      }

      const decryptedPassword = decryptdPassword(user.password);
      if (password !== decryptedPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const existingToken = await this.fullAuthService.getRefreshTokenByUserId(user.userId.toString());
  
      if (existingToken) {
        const now = new Date();
  
        if (existingToken.expiresAt > now) {
          const payload = this.fullAuthService.createPayload({
            id: user.userId,
            username: user.username,
            role: user.role,
          });
 
          const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
            secret: process.env.JWT_SECRET,
          });
  
          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
  
          res.cookie('refreshToken', existingToken.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
  
          return res.status(200).json({
            message: 'Login successful',
            success: true,
            user: {
              username: user.username,
              accessToken,
              profile: user.profile
                ? {
                    fname: user.profile.fname,
                    lname: user.profile.lname,
                    profilePicture: user.profile.profilePicture,
                  }
                : null,
            },
          });
        }
      }
      const payload = this.fullAuthService.createPayload({
        id: user.userId,
        username: user.username,
        role: user.role,
      });
  
      const { accessToken, refreshToken } = await this.fullAuthService.generateTokensAndAttachCookies(
        res,
        payload,
        user.userId.toString(),
        deviceInfo,
      );
  
      return res.status(200).json({
        message: 'Login successful',
        success: true,
        user: {
          username: user.username,
          accessToken,
          profile: user.profile
            ? {
                fname: user.profile.fname,
                lname: user.profile.lname,
                profilePicture: user.profile.profilePicture,
              }
            : null,
        },
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException || error instanceof BadRequestException)) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw error;
    }
  }
  

  async logout(
    @Res() res: Response,
    refreshToken: string,
    logoutFromAll: boolean = false,
  ): Promise<any> {
    try {
      if (logoutFromAll) {
        const decodedToken = this.fullAuthService.isTokenValid(refreshToken);
        if (!decodedToken) {
          return res.status(401).json({
            message: 'Invalid refresh token',
            success: false,
          });
        }
  
        const userId = decodedToken.id;
        await this.fullAuthService.terminateAllSessions(userId);
      } else {
        await this.fullAuthService.invalidateRefreshToken(refreshToken);
      }
  
      this.fullAuthService.clearCookies(res);
  
      return res.status(200).json({
        message: logoutFromAll
          ? 'Logged out from all devices successfully'
          : 'Logout successful',
        success: true,
      });
    } catch (error) {
      console.error('Error during logout:', error.message);
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  }
  
  
  
  async updateUser(
    id: UUID,
    updateData: Partial<RegisterUserDto>,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    } = {},
  ) {
    try {
      const { email, profile, contact, document, address } = updateData;
  
      const user = await this.userRepository.findOne({
        where: { userId: Equal(id.toString()) },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const updatedFields = {};
  
      if (email !== undefined) {
        const emailInUse = await this.userRepository.findOne({
          where: { email, userId: Not(Equal(id.toString())) },
        });
        if (emailInUse) {
          throw new BadRequestException(
            'This email is already in use by another user',
          );
        }
        user.email = email;
        updatedFields['email'] = email;
      }

      await this.userRepository.save(user);
  
      let profilePictureUrl: string | null = null;
  
      if (profile) {
        profilePictureUrl = await this.handleProfilePictureUpdate(
          files.profilePicture,
          user.userId.toString(),
          this.profileRepository, 
        );

      }
  
      if (profile) {
        await this.updateUserProfile(
          profile,
          user.userId.toString(),
          profilePictureUrl,
          updatedFields,
        );
      }
  
      if (contact) {
        await this.updateUserContact(
          contact,
          user.userId.toString(),
          updatedFields,
        );
      }
  
      if (address) {
        await this.updateUserAddress(
          address,
          user.userId.toString(),
          updatedFields,
        );
      }
  
      if (document) {
        await this.updateUserDocuments(
          document,
          files.documents,
          user.userId.toString(),
          updatedFields,
          files.documents && files.documents.length === 0 ? 'your-fallback-url' : undefined,
        );
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
        throw new InternalServerErrorException(
          'An unexpected error occurred during user update',
        );
      }
      throw error;
    }
  }
  
  async handleProfilePictureUpdate(
    profilePictureFiles: Express.Multer.File[] | undefined,
    userId: string,
    updatedFields: Record<string, any>,
  ): Promise<string | null> {
    if (!profilePictureFiles || profilePictureFiles.length === 0) {
      return null;
    }
  
    const profile = await this.profileRepository
      .createQueryBuilder('profile')
      .innerJoin('profile.user', 'user')
      .where('user.userId = :userId', { userId })
      .getOne();
  
    if (!profile) {
      throw new NotFoundException('Profile not found for the user');
    }
  
    const currentProfilePictureUrl = profile.profilePicture;
    if (currentProfilePictureUrl) {
      const publicId = extractPublicIdFromUrl(currentProfilePictureUrl);
      try {
        await deleteFileFromCloudinary(publicId);
      } catch (error) {
        throw new InternalServerErrorException('Failed to delete old profile picture');
      }
    }
  
    const newProfilePicture = profilePictureFiles[0];
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = Cloudinary.uploader.upload_stream(
        { folder: `user_profiles/${userId}`, resource_type: 'image' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );
      stream.end(newProfilePicture.buffer);
    });
  
    const newProfilePictureUrl = (uploadResult as any).secure_url;
    updatedFields['profilePicture'] = newProfilePictureUrl;
  
    profile.profilePicture = newProfilePictureUrl;
    await this.profileRepository.save(profile);
  
    return newProfilePictureUrl;
  }
  
  
  private async updateUserProfile(
    profileData,
    userId: string,
    profilePictureUrl: string | null,
    updatedFields: Record<string, any>,
  ) {
    const profile =
      typeof profileData === 'string' ? JSON.parse(profileData) : profileData;
    const userProfile = await this.profileRepository.findOne({
      where: { user: Equal(userId) },
    });

    const profileUpdateData = {
      profilePicture: profilePictureUrl ?? userProfile?.profilePicture,
      fname: profile.fname ?? userProfile?.fname,
      lname: profile.lname ?? userProfile?.lname,
      gender: profile.gender ?? userProfile?.gender,
      dob: profile.dob ? new Date(profile.dob) : userProfile?.dob,
    };

    await this.profileRepository.update(
      userProfile.profileId.toString(),
      profileUpdateData,
    );
    updatedFields['profile'] = profileUpdateData;
  }

  private async updateUserContact(
    contactData,
    userId: string,
    updatedFields: Record<string, any>,
  ) {
    const contact =
      typeof contactData === 'string' ? JSON.parse(contactData) : contactData;
    const userContact = await this.contactRepository.findOne({
      where: { user: Equal(userId) },
    });

    const contactUpdateData = {
      phoneNumber: contact.phoneNumber ?? userContact?.phoneNumber,
      alternatePhoneNumber:
        contact.alternatePhoneNumber ?? userContact?.alternatePhoneNumber,
      telephoneNumber: contact.telephoneNumber ?? userContact?.telephoneNumber,
    };

    await this.contactRepository.update(
      userContact.contactId,
      contactUpdateData,
    );
    updatedFields['contact'] = contactUpdateData;
  }

  private async updateUserAddress(
    addressData,
    userId: string,
    updatedFields: Record<string, any>,
  ) {
    const addressArray =
      typeof addressData === 'string' ? JSON.parse(addressData) : addressData;

    if (Array.isArray(addressArray) && addressArray.length > 0) {
      await this.addressRepository.delete({ user: Equal(userId) });

      const newAddresses = addressArray.map((addr) =>
        this.addressRepository.create({
          addressType: addr.addressType ?? 'default',
          wardNumber: addr.wardNumber ?? 'N/A',
          municipality: addr.municipality ?? 'N/A',
          province: addr.province ?? 'N/A',
          district: addr.district ?? 'N/A',
          user: Object.assign(new User(), { userId }),
        }),
      );

      const savedAddresses = await this.addressRepository.save(newAddresses);
      updatedFields['address'] = savedAddresses;
    }
  }

  private async updateUserDocuments(
    documentData: any,
    documentFiles: Express.Multer.File[] = [],
    userId: string,
    updatedFields: Record<string, any>,
    fallbackDocumentFile?: string,
  ) {
    const documents =
      typeof documentData === 'string' ? JSON.parse(documentData) : documentData;

    if (Array.isArray(documents) && documents.length > 0) {
      const existingDocuments = await this.documentRepository.find({
        where: { user: Equal(userId) },
      });
  
      if (existingDocuments.length > 0) {
        for (const existingDoc of existingDocuments) {
          if (existingDoc.documentFile) {
            const publicId = extractPublicIdFromUrl(existingDoc.documentFile);
            try {
              await deleteFileFromCloudinary(publicId);

            } catch (error) {
              console.error(
                `Failed to delete old document from Cloudinary: ${existingDoc.documentFile}`,
                error,
              );
            }
          }
        }
      }
  
      await this.documentRepository.delete({ user: Equal(userId) });

      const newDocuments = await Promise.all(
        documents.map(async (doc, index) => {
          let documentFileUrl = doc.documentFile || null;

          if (documentFiles && documentFiles[index]) {
            const [uploadedDocumentUrl] = await uploadFilesToCloudinary(
              [documentFiles[index].buffer],
              'documents',
            );
            documentFileUrl = uploadedDocumentUrl;
          }
  
          if (!documentFileUrl && fallbackDocumentFile) {
            documentFileUrl = fallbackDocumentFile;
          }
          if (!documentFileUrl) {
            throw new BadRequestException(
              `Document file or URL is required for "${doc.documentName}"`,
            );
          }

          return this.documentRepository.create({
            documentName: doc.documentName ?? `Document ${index + 1}`,
            documentFile: documentFileUrl,
            user: { userId: userId } as unknown as User,
          });
        }),
      );

      const savedDocuments = await this.documentRepository.save(newDocuments);
      updatedFields['documents'] = savedDocuments;
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
      address: user.address?.map((addr) => ({
        addressType: addr.addressType,
        wardNumber: addr.wardNumber,
        municipality: addr.municipality,
        district: addr.district,
        province: addr.province,
      })),
      documents: user.document?.map((doc) => ({
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
      throw new InternalServerErrorException({
        message: 'Error fetching users',
        status: 500,
        success: false,
        error: error.message,
      });
    }
  }

  async getSingleUser(userId: UUID) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['profile', 'address', 'contact', 'document'],
      });

      if (!user) {
        throw new NotFoundException({
          message: 'User not found',
          status: 404,
          success: false,
        });
      }

      return {
        message: 'User fetched successfully',
        status: 200,
        success: true,
        user: this.formatUserResponse(user),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          message: 'Failed to fetch user data',
          status: 500,
          success: false,
        });
      }
    }
  }

  async getUsersByRole(
    role: ROLE,
    staffRole?: STAFFROLE,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const skip = (page - 1) * limit;

      if (![ROLE.ADMIN, ROLE.STUDENT, ROLE.STAFF, ROLE.PARENT].includes(role)) {
        throw new BadRequestException({
          message: 'Invalid role provided',
          status: 400,
          success: false,
        });
      }

      if (role === ROLE.STAFF) {
        if (!staffRole) {
          const allStaffResponse = await this.staffService.findAllStaff();
          if (allStaffResponse.status === 404) {
            return {
              message: 'No staff members found',
              status: 404,
              success: false,
              data: [],
              total: 0,
              page,
              limit,
              totalPages: 0,
            };
          }

          const total = allStaffResponse.data.length;
          const paginatedStaff = allStaffResponse.data.slice(
            skip,
            skip + limit,
          );

          return {
            message: 'Staff members fetched successfully',
            status: 200,
            success: true,
            data: paginatedStaff,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          };
        }

        const roleData = await this.staffRepository.find({
          where: { staffRole: staffRole },
          relations: [
            'user',
            'user.profile',
            'user.address',
            'user.contact',
            'user.document',
          ],
        });

        const total = roleData.length;
        const paginatedStaff = roleData.slice(skip, skip + limit);

        const formattedStaff = paginatedStaff.map((staff) => ({
          user: this.formatUserResponse(staff.user),
          staffId: staff.staffId,
          hireDate: staff.hireDate,
          salary: staff.salary,
          staffRole: staff.staffRole,
        }));
        return {
          message: 'Staff members fetched successfully',
          status: 200,
          success: true,
          data: formattedStaff,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      }

      let roleData;
      switch (role) {
        case ROLE.STUDENT:
          roleData = await this.studentRepository.find({});
          break;
        case ROLE.PARENT:
          roleData = await this.parentRepository.find({});
          break;
        default:
          break;
      }

      const whereClause = { role } as any;
      const [users, total] = await this.userRepository.findAndCount({
        where: whereClause,
        relations: ['profile', 'address', 'contact', 'document'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

      const formattedUsers = users.map(this.formatUserResponse);

      const finalData = formattedUsers.map((user, index) =>
        roleData && roleData[index] ? { user, ...roleData[index] } : null,
      );

      return {
        message: 'Users fetched successfully',
        status: 200,
        success: true,
        data: finalData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        console.error(error);
        throw new InternalServerErrorException({
          message: 'Failed to fetch users by role',
          status: 500,
          success: false,
        });
      }
    }
  }

  async searchUser(
    searchTerm: string,
    searchBy: 'name' | 'role' | 'email' | 'username' | 'gender',
    page: number = 1,
    limit: number = 10,
    role?: ROLE, 
  ) {
    try {
      const skip = (page - 1) * limit;
      let whereClause;
  
      switch (searchBy) {
        case 'name':
          const [fname, lname] = searchTerm.split(' ');
          if (lname) {
            whereClause = {
              profile: { fname: ILike(`%${fname}%`), lname: ILike(`%${lname}%`) },
              ...(role && { role }), 
            };
          } else {
            whereClause = [
              { profile: { fname: ILike(`%${searchTerm}%`) }, ...(role && { role }) },
              { profile: { lname: ILike(`%${searchTerm}%`) }, ...(role && { role }) },
            ];
          }
          break;
  
        case 'gender':
          whereClause = { profile: { gender: searchTerm.toUpperCase() }, ...(role && { role }) };
          break;
  
        case 'role':
          whereClause = { role: searchTerm as ROLE };
          break;
  
        case 'email':
          whereClause = { email: ILike(`%${searchTerm}%`) };
          break;
  
        case 'username':
          whereClause = { username: ILike(`%${searchTerm}%`) };
          break;
  
        default:
          throw new BadRequestException('Invalid search criteria');
      }
  
      const [users, total] = await this.userRepository.findAndCount({
        where: whereClause,
        relations: ['profile', 'contact', 'address', 'document'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
  
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          let roleData = null;
  
          switch (user.role) {
            case ROLE.STUDENT:
              roleData = await this.studentRepository.findOne({ where: { user: { userId: user.userId } } });
              break;
            case ROLE.STAFF:
              roleData = await this.staffRepository.findOne({ where: { user: { userId: user.userId } } });
              break;
            case ROLE.PARENT:
              roleData = await this.parentRepository.findOne({ where: { user: { userId: user.userId } } });
              break;
            default:
              break;
          }
  
          return {
            ...this.formatUserResponse(user),
            roleData,
          };
        }),
      );
  
      return {
        message: 'Users fetched successfully',
        status: 200,
        success: true,
        data: enrichedUsers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        console.error(error);
        throw new InternalServerErrorException({
          message: 'An unexpected error occurred during search',
          status: 500,
          success: false,
        });
      }
    }
  }
  
  async deactivateUsers(userIds: UUID[]) {
    const results = [];

    try {
      for (const userId of userIds) {
        try {
          const user = await this.userRepository.findOne({
            where: { userId },
            relations: ['profile', 'address', 'contact', 'document'],
          });

          if (!user) {
            results.push({
              userId,
              message: 'User not found',
              status: 404,
              success: false,
            });
            continue;
          }

          user.isActivated = false;
          await this.userRepository.save(user);
          if (user.profile) {
            user.profile.isActivated = false;
            await this.profileRepository.save(user.profile);
          }

          if (user.address && Array.isArray(user.address)) {
            await Promise.all(
              user.address.map(async (addr) => {
                addr.isActivated = false;
                await this.addressRepository.save(addr);
              }),
            );
          }

          if (user.contact) {
            user.contact.isActivated = false;
            await this.contactRepository.save(user.contact);
          }

          if (user.document && Array.isArray(user.document)) {
            await Promise.all(
              user.document.map(async (doc) => {
                doc.isActivated = false;
                await this.documentRepository.save(doc);
              }),
            );
          }

          results.push({
            userId,
            message: 'User and related data deactivated successfully',
            status: 200,
            success: true,
          });
        } catch (error) {
          results.push({
            userId,
            message: 'Failed to deactivate user and related data',
            status: 500,
            success: false,
          });
        }
      }

      return {
        message: 'Batch deactivation completed',
        status: 200,
        success: true,
        results,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred during batch deactivation',
        status: 500,
        success: false,
      });
    }
  }
  async deleteUsers(userIds: UUID[]) {
    const results = [];

    try {
      for (const userId of userIds) {
        try {
          const user = await this.userRepository.findOne({ where: { userId } });

          if (!user) {
            results.push({
              userId,
              message: 'User not found',
              status: 404,
              success: false,
            });
            continue;
          }

          await this.userRepository.delete(userId.toString());

          results.push({
            userId,
            message: 'User and all related data deleted successfully',
            status: 200,
            success: true,
          });
        } catch (error) {
          if (error.code === '23503') {
            results.push({
              userId,
              message:
                'Cannot delete user because it is referenced by other records',
              status: 400,
              success: false,
            });
          } else {
            results.push({
              userId,
              message: 'Failed to delete user and related data',
              status: 500,
              success: false,
            });
          }
        }
      }

      return {
        message: 'Batch deletion completed',
        status: 200,
        success: true,
        results,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred during batch deletion',
        status: 500,
        success: false,
      });
    }
  }
}

