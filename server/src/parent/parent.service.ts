import { User } from '../user/authentication/entities/authentication.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { ParentDto } from './dto/parent.dto';
import { ROLE } from '../utils/role.helper';
import { AuthenticationService } from 'src/user/authentication/authentication.service';
import {
  decryptdPassword,
  generateRandomPassword,
  generateUsername,
} from 'src/utils/utils';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadFilesToCloudinary } from 'src/utils/file-upload.helper';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

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
  ): Promise<{
    status: number;
    message: string;
    parent?: any;
    user?: any;
    plainPassword?: any;
  }> {
    const { childNames, email, role, profile, contact, address, document } =
      createdParentDto;

    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException(
        'Profile information (fname and lname) is required.',
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Parent with this email already exists.');
    }

    let profilePictureUrl: string | null = null;
    const documentUrls = [];

    if (files.profilePicture && files.profilePicture.length > 0) {
      try {
        const profilePictureBuffer = files.profilePicture[0].buffer;
        const profilePictureUrls = await uploadFilesToCloudinary(
          [profilePictureBuffer],
          'profile_pictures',
        );
        profilePictureUrl = profilePictureUrls[0];
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to upload profile picture',
        );
      }
    }

    if (files.documents && files.documents.length > 0) {
      try {
        const documentBuffers = files.documents.map((doc) => doc.buffer);
        const uploadedDocumentUrls = await uploadFilesToCloudinary(
          documentBuffers,
          'documents',
        );

        documentUrls.push(
          ...uploadedDocumentUrls.map((url, index) => ({
            documentName:
              document[index]?.documentName || `Document ${index + 1}`,
            documentFile: url,
          })),
        );
      } catch (error) {
        throw new InternalServerErrorException('Failed to upload documents');
      }
    }

    const registerDto = {
      email,
      role,
      profile,
      address,
      contact,
      document: documentUrls,
      password: generateRandomPassword(),
      createdAt: new Date().toISOString(),
      refreshToken: null,
    };

    const createUserResponse = await this.userService.register(
      registerDto,
      files,
    );
    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException(
        'Error occurred while creating user',
      );
    }

    const userReference = await this.userRepository.findOne({
      where: { userId: createUserResponse.user.id },
    });

    if (!userReference) {
      return { status: 500, message: 'Error finding user after creation' };
    }

    const newParent = this.parentRepository.create({
      childNames,
      user: userReference,
    });

    await this.parentRepository.save(newParent);
    let plainPassword = decryptdPassword(userReference.password);
    return {
      status: 201,
      message: 'Parent created successfully',
      parent: {
        ...newParent,
        documents: documentUrls,
      },
      user: createUserResponse.user,
      plainPassword: plainPassword,
    };
  }

  async updateParent(
    id: UUID,
    updateParentDto: ParentDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    } = {},
  ) {
    try {
      const { childNames } = updateParentDto;

      const parent = await this.parentRepository.findOne({
        where: {
          parentId: Equal(id.toString()),
        },
        relations: ['user', 'student'],
      });

      if (!parent) {
        throw new NotFoundException('Parent not found');
      }
      if (!parent.user) {
        throw new NotFoundException('User associated with parent not found');
      }
      // if (!parent.student) {
      //   throw new NotFoundException('Student associated with user not found');
      // }
      const userUpdateResult = await this.userService.updateUser(
        parent.user.userId,
        updateParentDto,
        files,
      );
      if (childNames !== undefined) {
        parent.childNames = childNames;
      }
      await this.parentRepository.save(parent);

      return {
        ...userUpdateResult.user.address,
        ...userUpdateResult.user.contact,
        ...userUpdateResult.user.documents,
        ...userUpdateResult.user.profile,
        parent,
        message: 'Parent Updated successfully',
      };
    } catch (error) {
      console.error('Error occur',error)
      throw new Error('Internal server problem');
    }
  }
}
