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
import { generateRandomPassword, generateUsername } from 'src/utils/utils';
import { ROLE } from 'src/utils/role.helper'; 
import { STAFFROLE } from 'src/utils/role.helper';
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
  ) {}

  async createStaff(
    createStaffDto: StaffDto,
    files: {
      profilePicture?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ): Promise<{ status: number; message: string; staff?: any; user?: any }> {
    const { hireDate, salary, staffRole, email, profile, address, contact, document } = createStaffDto;
  
    if (!profile || !profile.fname || !profile.lname) {
      throw new BadRequestException('Profile information (fname and lname) is required.');
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
          documentName: documentMetadata[index]?.documentName || `Document ${index + 1}`,
          documentFile: url,
        }))
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
      throw new InternalServerErrorException('Error occurs while creating user');
    }
  
    const newStaff = this.staffRepository.create({
      hireDate,
      salary,
      staffRole: staffRole.trim() as STAFFROLE,
      user: createUserResponse.user // this isnt working
    });
  
    await this.staffRepository.save(newStaff);
  
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

  async updateStaff(id: UUID, updateStaffDto: Partial<StaffDto>, files) {
    try {
      const {
        hireDate,
        salary,
        staffRole
      } = updateStaffDto;

      const staff = await this.staffRepository.findOne({
        where: { staffId: Equal(id.toString()) },
        relations:[
          'user'
        ]
      });
      if (!staff) {
        throw new NotFoundException('Staff not found');
      }
      console.log(staff)
      
      const updateUser = await this.userService.updateUser(
        staff.user.userId, // userid unable to send
        updateStaffDto,
        files,
      );
      if (updateUser.status !== 200) {
        throw new Error('error while updating user details');
      }
      if(hireDate) staff.hireDate = hireDate;
      if(salary) staff.salary = salary;
      if(staffRole) staff.staffRole = staffRole.trim() as STAFFROLE;

      const updatedStaff = this.staffRepository.save(staff);
      return {
        msg: 'staff updated successfully',
        updateUser,
        updatedStaff,
      };
    } catch (err) {
      console.log(err);
      return {
        msg: "error occured",
        err
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
