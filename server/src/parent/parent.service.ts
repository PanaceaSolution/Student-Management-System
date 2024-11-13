import { User } from '../user/authentication/entities/authentication.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { ParentDto } from './dto/parent.dto';
import { AuthenticationService } from 'src/user/authentication/authentication.service';
import { generateRandomPassword, generateUsername } from 'src/utils/utils';
import { uploadFilesToCloudinary } from 'src/utils/file-upload.helper';

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
  ): Promise<{ status: number; message: string; parent?: any; user?: any }> {
    const { childNames, email, role, profile, contact, address, document } = createdParentDto;
    console.log("Before Parsing:", createdParentDto);

    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException('Profile information (fname and lname) is required.');
    }

    const existedParent = await this.userRepository.findOne({ where: { email } });
    if (existedParent) {
      throw new BadRequestException('Parent already exists');
    }

    const username = generateUsername(profile.fname, profile.lname, role);
    console.log('Generated Username:', username);

    let profilePictureUrl: string | null = null;

    if (files.profilePicture && files.profilePicture.length > 0) {
      const profilePictureBuffer = files.profilePicture[0].buffer;
      const profilePictureUrls = await uploadFilesToCloudinary([profilePictureBuffer], 'profile_pictures');
      profilePictureUrl = profilePictureUrls[0];
    }

    const documentMetadata = document || [];
    const documentUrls = [];

    if (files.documents && files.documents.length > 0) {
      const documentBuffers = files.documents.map((doc) => doc.buffer);
      const uploadedDocumentUrls = await uploadFilesToCloudinary(documentBuffers, 'documents');

      documentUrls.push(
        ...uploadedDocumentUrls.map((url, index) => ({
          documentName: documentMetadata[index]?.documentName || `Document ${index + 1}`,
          documentFile: url,
        }))
      );
    }

    const registerDto = {
      email,
      role,
      profile,
      address,
      contact,
      document: documentUrls,
      username,
      password: generateRandomPassword(),
      createdAt: new Date().toISOString(),
      refreshToken: null,
      profilePicture: profilePictureUrl,
    };

    const createUserResponse = await this.userService.register(registerDto, files);

    if (!createUserResponse || !createUserResponse.user) {
      throw new InternalServerErrorException('Error occurred while creating user');
    }

    const newParent = this.parentRepository.create({ childNames });
    await this.parentRepository.save(newParent);

    return {
      status: 201,
      message: 'Parent created successfully',
      parent: createdParentDto, 
      user: { email: createdParentDto.email }
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