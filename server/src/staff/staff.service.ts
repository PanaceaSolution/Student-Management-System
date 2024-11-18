import {
  BadRequestException,
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
import { decryptdPassword, generateRandomPassword, generateUsername } from 'src/utils/utils';
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
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createStaff(
    createStaffDto: StaffDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ): Promise<{ status: number; message: string; staff?: any; user?: any }> {
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
    // console.log('createuserResponse', createUserResponse);

    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException(
        'Error occurs while creating user',
      );
    }
    const userReference = await this.userRepository.findOne({
      where: { userId: createUserResponse.user.id },
    });

    // console.log('UserReference for staff', userReference);

    if (!userReference) {
      return { status: 500, message: 'Error finding user after creation' };
    }

    const newStaff = this.staffRepository.create({
      hireDate,
      salary,
      staffRole: staffRole.trim() as STAFFROLE,
      // user: userReference,
    });
    const plainPassword = decryptdPassword(userReference.password)
  console.log("Plainpassword is", plainPassword);
  
    await this.staffRepository.save(newStaff);

    return {
      status: 201,
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

      const updatedStaff = this.staffRepository.save(staff);
      console.log(updatedStaff);

      return {
        status:201,
        message: 'staff updated successfully',
        updateUser,
        updatedStaff,
        success:true
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Internal server error',
        error,
        status:500,
        success:false
      };
    }
  }

  findAll() {
    return `This action returns all staff`;
  }

  async findStaffById(id: string) {
    const student = await this.staffRepository.findOne({ where: { staffId: id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
