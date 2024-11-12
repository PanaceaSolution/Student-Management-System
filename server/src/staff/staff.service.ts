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
import { generateRandomPassword, generateUsername } from 'src/utils/utils';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { STAFFROLE } from 'src/utils/role.helper';

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
  ): Promise<{ status: number; message: string; staff?: any; user?: any }> {
    const { hireDate, salary, staffRole, email, role, profile, address, contact } = createStaffDto;

    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException('Profile information (fname and lname) is required.');
    }

    // const HD = moment(hireDate, 'YYYY-MM-DD');
    // if (!HD.isValid()) {
    //   throw new BadRequestException('Invalid date format for Hire Date');
    // }
    // const HireDateIsoString = HD.toISOString();

    const staffExist = await this.userRepository.findOne({
      where: { email },
    });
    if (staffExist) {
      throw new BadRequestException('Staff already exists in the database');
    }

    const tempDir = './temp_uploads';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    let profilePicturePath: string | null = null;
    if (files.profilePicture && files.profilePicture.length > 0) {
      const uniqueName = `${uuidv4()}${path.extname(files.profilePicture[0].originalname)}`;
      profilePicturePath = path.join(tempDir, uniqueName);
      fs.writeFileSync(profilePicturePath, files.profilePicture[0].buffer);
      files.profilePicture[0].path = profilePicturePath;
    }

    const documentPaths = [];
    if (files.documents && files.documents.length > 0) {
      files.documents.forEach((documentFile) => {
        const uniqueName = `${uuidv4()}${path.extname(documentFile.originalname)}`;
        const documentPath = path.join(tempDir, uniqueName);
        fs.writeFileSync(documentPath, documentFile.buffer);
        documentFile.path = documentPath;
        documentPaths.push(documentPath);
      });
    }

    const registerDto = {
      email,
      role,
      profile,
      address,
      contact,
      document: [],
      username: generateUsername(profile.fname, profile.lname, role),
      password: generateRandomPassword(),
      createdAt: new Date().toISOString(),
      refreshToken: null,
    };

    const createUserResponse = await this.userService.register(registerDto, files);

    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException('Error occurs while creating user');
    }

    const newStaff = this.staffRepository.create({
      hireDate,
      salary,
      staffRole: staffRole.trim() as STAFFROLE, // Convert string to enum
    });

    await this.staffRepository.save(newStaff);

    if (profilePicturePath) fs.unlinkSync(profilePicturePath);
    documentPaths.forEach((docPath) => fs.unlinkSync(docPath));

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
