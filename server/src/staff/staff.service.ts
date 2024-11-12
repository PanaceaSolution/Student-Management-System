import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { User } from '../user/authentication/entities/authentication.entity';
import { generateRandomPassword, generateUsername } from 'src/utils/utils';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
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
  // async create(createStaffDto: CreateStaffDto) {
  //   const username = 'hi';
  //   const password = 'hi';
  //   const createdAt = '2024-01-21';
  //   const refreshToken = null;

  //   const {
  //     email,
  //     role,
  //     profile,
  //     address,
  //     contact,
  //     // document: [document],
  //     hireDate,
  //     salary,
  //     staffRole,
  //   } = createStaffDto;

  //   const registerDto = {
  //     email,
  //     role,
  //     profile,
  //     address,
  //     contact,
  //     document,
  //     username,
  //     password,
  //     createdAt,
  //     refreshToken,
  //   };

  //   // Register user
  //   // const createUser = await this.userService.register(registerDto);

  //   // if (!createUser) {
  //   //   throw new Error('User creation failed.');
  //   // }

  //   // // Only reference the userId or the full User entity directly
  //   // const userReference = await this.userRepository.findOne({
  //   //   where: {  userId: createUser.user.id },
  //   // });
  //   // if (!userReference) {
  //   //   throw new Error('User not found after creation.');
  //   // }

  //   // // Create staff-specific details with the User reference
  //   // const newStaff = this.staffRepository.create({
  //   //   user: userReference, // Pass only the user reference here
  //   //   hireDate,
  //   //   salary,
  //   //   staffRole,
  //   // });

  //   // await this.staffRepository.save(newStaff);

  //   // return {
  //   //   message: 'Staff member created successfully',
  //   //   status: 200,
  //   //   staff: newStaff,
  //   // };
  // }

  async createStaff(
    createStaffDto: CreateStaffDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    const {
      role,
      email,
      profile,
      address,
      contact,
      staffRole,
      salary,
      hireDate,
    } = createStaffDto;

    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException(
        'Profile information (fname and lname) is required.',
      );
    }

     const HD = moment(hireDate, 'YYYY-MM-DD');
    if (!HD.isValid()) {
      throw new BadRequestException('Invalid date format for Hire Date');
    }
    const HireDateIsoString = HD.toISOString();

    const existedStaff = await this.userRepository.findOne({
      where: { email },
    });
    if (existedStaff) {
      throw new BadRequestException('Staff already exists');
    }

    const tempDir = './temp_uploads';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    let profilePicturePath: string | null = null;
    if (files.profilePicture && files.profilePicture.length > 0) {
      const uniqueName = `${uuidv4()}${path.extname(
        files.profilePicture[0].originalname,
      )}`;
      profilePicturePath = path.join(tempDir, uniqueName);
      fs.writeFileSync(profilePicturePath, files.profilePicture[0].buffer);
      files.profilePicture[0].path = profilePicturePath;
    }
    const documentPaths = [];
    if (files.documents && files.documents.length > 0) {
      files.documents.forEach((documentFile, index) => {
        const uniqueName = `${uuidv4()}${path.extname(
          documentFile.originalname,
        )}`;
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

    const createUserResponse = await this.userService.register(
      registerDto,
      files,
    );
    // console.log(createUserResponse);
    
    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException(
        'Error occurs while creating user',
      );
    }

    // const userReference = await this.userRepository.findOne({
    //   where: { userId: createUserResponse.user.id },
    // });
    // if (!userReference) {
    //   return {
    //     status: 500,
    //     message: 'Error finding user after creation',
    //   };
    // }


    const newStaff = this.staffRepository.create({
      salary,
      hireDate: HireDateIsoString,
      staffRole:STAFFROLE[staffRole as keyof typeof STAFFROLE],
    });

    await this.staffRepository.save(newStaff);

    if (profilePicturePath) fs.unlinkSync(profilePicturePath);
    documentPaths.forEach((docPath) => fs.unlinkSync(docPath));

    return {
      status: 201,
      message: 'Student created successfully',
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

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
