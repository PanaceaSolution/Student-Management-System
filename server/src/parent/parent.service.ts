import { UserProfile } from '../user/userEntity/profile.entity';
import { UserAddress } from '../user/userEntity/address.entity';
import { UserContact } from '../user/userEntity/contact.entity';
import { UserDocuments } from '../user/userEntity/document.entity';
import { User } from '../user/authentication/entities/authentication.entity';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { ParentDto } from './dto/parent.dto';
import { ROLE } from '../utils/role.helper';


@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(UserContact)
    private readonly userContactRepository: Repository<UserContact>,
    @InjectRepository(UserDocuments)
    private readonly userDocumentsRepository: Repository<UserDocuments>,
  ) {}


  async createParent(createParentDto: ParentDto): Promise<{ status: number; message: string; parent: Parent }> {
    const { email, username, password, profile, addresses, contact, documents } = createParentDto;


    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists');
    }

    const user = this.userRepository.create({
      email,
      username,
      password,
      role: ROLE.PARENT,
      isActivated: true,
    });
    await this.userRepository.save(user);


    const userProfile = this.userProfileRepository.create({
      ...profile,
      user,
    });
    await this.userProfileRepository.save(userProfile);


    const userAddresses = addresses.map((address) => this.userAddressRepository.create({
      ...address,
      user,
    }));
    await this.userAddressRepository.save(userAddresses);

    const userContact = this.userContactRepository.create({
      ...contact,
      user,
    });
    await this.userContactRepository.save(userContact);

    const userDocuments = documents.map((doc) => this.userDocumentsRepository.create({
      ...doc,
      user,
    }));
    await this.userDocumentsRepository.save(userDocuments);

    const parent = this.parentRepository.create({
      fname: profile.fname, 
      lname: profile.lname, 
      email,
      gender: profile.gender,
      user,
    });
    await this.parentRepository.save(parent);

    return {
      status: 201,
      message: 'Parent created successfully',
      parent,
    };
  }

  async findOne(parentId: string): Promise<Parent> {
    const parent = await this.parentRepository.findOne({
      where: { id: parentId }, 
      relations: ['user', 'user.profile', 'user.address', 'user.contact', 'user.document'],
    });
  
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }
  
    return parent;
  }
  
}
