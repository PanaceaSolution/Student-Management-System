import { User } from '../user/authentication/entities/authentication.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { ParentDto } from './dto/parent.dto';
import { ROLE } from '../utils/role.helper';
import { AuthenticationService } from 'src/user/authentication/authentication.service';
import { generateRandomPassword, generateUsername } from 'src/utils/utils';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createParent(
    createdParentDto: ParentDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    const { childNames, email, role, profile, contact, address } =
      createdParentDto;

    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException(
        'Profile information (fname and lname) is required.',
      );
    }

    const existedParent = await this.userRepository.findOne({
      where: { email },
    });
    if (existedParent) {
      throw new BadRequestException('Parent already exists');
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
         files.documents.forEach((documentFile) => {
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
      document: [], // Add the 'document' property here
      username: generateUsername(profile.fname, profile.lname, role),
      password: generateRandomPassword(),
      createdAt: new Date().toISOString(),
      refreshToken: null,
    };
    const createUserResponse = await this.userService.register(
      registerDto,
      files,
    );
 
    const newParent = await this.parentRepository.create({
      childNames,
    });

    return {
      status: 201,
      message: 'Parent created successfully',
      parent: newParent,
      user: createUserResponse.user,
    };
  }

  // async findOne(parentId: string): Promise<Parent> {
  //   const parent = await this.parentRepository.findOne({
  //     where: { id: parentId },
  //     relations: [
  //       'user',
  //       'user.profile',
  //       'user.address',
  //       'user.contact',
  //       'user.document',
  //     ],
  //   });

  //   if (!parent) {
  //     throw new NotFoundException('Parent not found');
  //   }

  //   return parent;
  // }
}
