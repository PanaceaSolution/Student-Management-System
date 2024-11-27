import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Equal, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { StaffDto } from './dto/staff.dto';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { User } from '../user/authentication/entities/authentication.entity';
import ResponseModel, {
  decryptdPassword,
  generateRandomPassword,
  generateUsername,
} from 'src/utils/utils';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { STAFFROLE, ROLE } from 'src/utils/role.helper';
import { uploadFilesToCloudinary } from 'src/utils/file-upload.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createStaff(
    createStaffDto: StaffDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    const {
      hireDate,
      salary,
      staffRole,
      email,
      profile,
      address,
      contact,
      document,
    } = createStaffDto;

    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException(
        'Profile information (fname and lname) is required.',
      );
    }

    if (!Object.values(STAFFROLE).includes(staffRole as STAFFROLE)) {
      throw new BadRequestException('Invalid staff role');
    }

    const profilePictureUrl: string | null = null;

    const documentMetadata = document || [];
    const documentUrls = [];

    if (files.documents && files.documents.length > 0) {
      const documentBuffers = files.documents.map((doc) => doc.buffer);
      const uploadedDocumentUrls = await uploadFilesToCloudinary(
        documentBuffers,
        'documents',
      );

      documentUrls.push(
        ...uploadedDocumentUrls.map((url, index) => ({
          documentName:
            documentMetadata[index]?.documentName || `Document ${index + 1}`,
          documentFile: url,
        })),
      );
    }

    const registerDto = {
      email,
      role: ROLE.STAFF,
      profile,
      address,
      contact,
      document: documentUrls,
      password: generateRandomPassword(),
      createdAt: new Date().toISOString(),
      refreshToken: null,
      profilePicture: profilePictureUrl,
    };

    const createUserResponse = await this.userService.register(
      registerDto,
      files,
      staffRole,
    );

    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException(
        'Error occurs while creating user',
      );
    }
    const userReference = await this.userRepository.findOne({
      where: { userId: createUserResponse.user.id },
    });

    if (!userReference) {
      return { status: 500, message: 'Error finding user after creation' };
    }

    const newStaff = this.staffRepository.create({
      hireDate,
      salary,
      staffRole: staffRole.trim() as STAFFROLE,
      user: userReference,
    });
    const plainPassword = decryptdPassword(userReference.password);
    console.log('Plainpassword is', plainPassword);

    await this.staffRepository.save(newStaff);

    return {
      status: 201,
      success: true,
      message: 'Staff created successfully',
      staff: { ...newStaff, user: createUserResponse.user },
      // user: createUserResponse,
    };
  }

  async updateStaff(id: UUID, updateStaffDto: Partial<StaffDto>, files) {
    try {
      const { hireDate, salary, staffRole } = updateStaffDto;

      const staff = await this.staffRepository.findOne({
        where: { staffId: Equal(id.toString()) },
        relations: ['user'],
      });
      if (!staff) {
        throw new NotFoundException('Staff not found');
      }
      console.log(staff);

      const updateUser = await this.userService.updateUser(
        staff.user.userId, // userid unable to send
        updateStaffDto,
        files,
      );
      if (updateUser.status !== 200) {
        throw new Error('error while updating user details');
      }
      if (hireDate) staff.hireDate = hireDate;
      if (salary) staff.salary = salary;
      if (staffRole) staff.staffRole = staffRole.trim() as STAFFROLE;

      const updatedStaff = await this.staffRepository.save(staff);
      console.log('Updateed staff is:', updatedStaff);

      return {
        status: 201,
        message: 'Staff updated successfully',
        updateUser,
        updatedStaff,
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Internal server error',
        error,
        status: 500,
        success: false,
      };
    }
  }

  async findAllStaff(): Promise<{
    status: number;
    message: string;
    data?: any;
  }> {
    try {
      const staffMembers = await this.staffRepository.find({
        relations: [
          'user',
          'user.profile',
          'user.address',
          'user.contact',
          'user.document',
        ],
      });

      if (!staffMembers.length) {
        return {
          status: 404,
          message: 'No staff members found',
        };
      }

      const formattedStaff = staffMembers.map((staff) => ({
        user: {
          id: staff.user.userId,
          email: staff.user.email,
          username: staff.user.username,
          role: staff.user.role,
          isActivated: staff.user.isActivated,
          createdAt: staff.user.createdAt,
          profile: {
            fname: staff.user.profile?.fname,
            lname: staff.user.profile?.lname,
            gender: staff.user.profile?.gender,
            dob: staff.user.profile?.dob,
            profilePicture: staff.user.profile?.profilePicture,
          },
          contact: {
            phoneNumber: staff.user.contact?.phoneNumber,
            alternatePhoneNumber: staff.user.contact?.alternatePhoneNumber,
            telephoneNumber: staff.user.contact?.telephoneNumber,
          },
          address: staff.user.address?.map((addr) => ({
            addressType: addr.addressType,
            wardNumber: addr.wardNumber,
            municipality: addr.municipality,
            district: addr.district,
            province: addr.province,
          })),
          documents: staff.user.document?.map((doc) => ({
            documentName: doc.documentName,
            documentFile: doc.documentFile,
          })),
          staffId: staff.staffId,
          hireDate: staff.hireDate,
          salary: staff.salary,
          staffRole: staff.staffRole,
        },
      }));

      return {
        status: 200,
        message: 'Staff members retrieved successfully',
        data: formattedStaff,
      };
    } catch (error) {
      console.error('Error fetching staff:', error);
      return {
        status: 500,
        message: 'Internal server error',
      };
    }
  }

  async findStaffById(id: string): Promise<any> {
    const staff = await this.staffRepository.findOne({
      where: { staffId: id },
      relations: ['user', 'user.address', 'user.contact', 'user.document'],
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    const formattedStaff = {
      staffId: staff.staffId,
      hireDate: staff.hireDate,
      salary: staff.salary,
      staffRole: staff.staffRole,
      user: {
        id: staff.user.userId,
        email: staff.user.email,
        username: staff.user.username,
        role: staff.user.role,
        isActivated: staff.user.isActivated,
        createdAt: staff.user.createdAt,
        profile: {
          fname: staff.user.profile?.fname,
          lname: staff.user.profile?.lname,
          gender: staff.user.profile?.gender,
          dob: staff.user.profile?.dob,
          profilePicture: staff.user.profile?.profilePicture,
        },
        contact: {
          phoneNumber: staff.user.contact?.phoneNumber,
          alternatePhoneNumber: staff.user.contact?.alternatePhoneNumber,
          telephoneNumber: staff.user.contact?.telephoneNumber,
        },
        address: staff.user.address?.map((addr) => ({
          addressType: addr.addressType,
          wardNumber: addr.wardNumber,
          municipality: addr.municipality,
          district: addr.district,
          province: addr.province,
        })),
        documents: staff.user.document?.map((doc) => ({
          documentName: doc.documentName,
          documentFile: doc.documentFile,
        })),
      },
    };

    return {
      status: 200,
      message: `Staff with ID ${id} retrieved successfully`,
      data: formattedStaff,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }

  async getStaffsNumber() {
    const staffNumber = await this.staffRepository.count();
    return new ResponseModel('Staffs fetched successfully', true, staffNumber);
  }

  async getTeachersNumber() {
    const teacherNumber = await this.staffRepository.count({
      where: {
        staffRole: STAFFROLE.TEACHER,
      },
    });
    return new ResponseModel(
      'Teachers fetched successfully',
      true,
      teacherNumber,
    );
  }
}
