//package imports
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, In, Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

//file imports
import { User } from '../user/authentication/entities/authentication.entity';
import { Parent } from './entities/parent.entity';
import { ParentDto } from './dto/parent.dto';
import { ROLE } from '../utils/role.helper';
import { AuthenticationService } from 'src/user/authentication/authentication.service';
import { decryptdPassword, generateRandomPassword } from 'src/utils/utils';
import { uploadFilesToCloudinary } from 'src/utils/file-upload.helper';
import { Student } from 'src/student/entities/student.entity';
import ResponseModel from 'src/utils/utils';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
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
    parent: Parent;
    user: User;
    plainPassword: string;
    success: boolean;
  }> {
    const {
      childNames,
      email,
      role,
      profile,
      contact,
      address,
      document,
      studentId,
    } = createdParentDto;

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
            document[index]?.documentName || `Document ${index + 1}`,
          documentFile: url,
        })),
      );
    }

    const students = studentId
      ? await this.studentRepository.find({
          where: { studentId: In(studentId) },
          relations: ['user', 'user.address', 'user.contact', 'user.document'],
        })
      : [];

    if (studentId && students.length !== studentId.length) {
      throw new NotFoundException('One or more student IDs are invalid.');
    }

    const parentAddress = students[0]?.user.address || address;
    const parentContact = students[0]?.user.contact || contact;
    const parentDocuments = students[0]?.user.document || documentUrls;

    const registerDto = {
      email,
      role,
      profile,
      address: Array.isArray(parentAddress) ? parentAddress : [parentAddress],
      contact: parentContact,
      document: Array.isArray(parentDocuments)
        ? parentDocuments.map((doc) => ({
            documentName: doc.documentName || 'Unknown',
            documentFile: doc.documentFile || '',
          }))
        : [],
      password: generateRandomPassword(),
      createdAt: new Date().toISOString(),
    };

    const newParent = this.parentRepository.create({
      student: students,
      childNames,
    });

    const parentCreated = await this.parentRepository.save(newParent);

    if (parentCreated) {
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
        where: { email: registerDto.email },
        relations: ['address', 'contact', 'document'],
      });

      if (!userReference) {
        throw new InternalServerErrorException(
          'Error finding user after creation',
        );
      }

      const finalParent = await this.parentRepository.save({
        ...newParent,
        user: userReference,
      });

      const plainPassword = decryptdPassword(userReference.password);

      return {
        success: true,
        parent: finalParent,
        user: userReference,
        plainPassword,
      };
    }

    throw new InternalServerErrorException('Error creating parent');
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
      if (!parent.student) {
        throw new NotFoundException('Student associated with user not found');
      }
      const userUpdateResult = await this.userService.updateUser(
        parent.user.userId,
        updateParentDto,
        files,
      );
      // if (childNames !== undefined) {
      //   parent.childNames = childNames;
      // }
      await this.parentRepository.save(parent);

      return new ResponseModel('Parent updated successfully', true, {
        ...userUpdateResult.user.address,
        ...userUpdateResult.user.contact,
        ...userUpdateResult.user.documents,
        ...userUpdateResult.user.profile,
        parent,
      });
    } catch (error) {
      return new ResponseModel('Error updating parent', false, error);
    }
  }

  async getParentsNumber() {
    const parentsNumber = await this.studentRepository.count();
    return new ResponseModel(
      'Parents fetched successfully',
      true,
      parentsNumber,
    );
  }
}
