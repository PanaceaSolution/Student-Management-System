import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
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
import * as moment from 'moment';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
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
  ): Promise<{ status: number; message: string; staff?: any; user?: any ;plainPassword?: any}> {
    const { hireDate, salary, staffRole, email, profile, address, contact, document } = createStaffDto;

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
      const uploadedDocumentUrls = await uploadFilesToCloudinary(documentBuffers, 'documents');

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

    const createUserResponse = await this.userService.register(registerDto, files, staffRole);

    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException(
        'Error occurs while creating user',
      );
    }

    const newStaff = this.staffRepository.create({
      hireDate,
      salary,
      staffRole: staffRole.trim() as STAFFROLE,
    });

    // await this.staffRepository.save(newStaff);
    // const plainPassword = decryptdPassword(registerDto.password);

    return {
      status: 201,
      message: 'Staff created successfully',
      staff: newStaff,
      user: createUserResponse.user,
    };
  }
  
  
  findAll() {
    return `This action returns all staff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: StaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
