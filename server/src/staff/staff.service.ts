import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { AuthenticationService } from '../user/authentication/authentication.service';
import { User } from '../user/authentication/entities/user.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly userService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createStaffDto: CreateStaffDto) {
    const username = 'hi';
    const password = 'hi';
    const createdAt = '2024-01-21';
    const refreshToken = null;

    const {
      email,
      role,
      profile,
      address,
      contact,
      document,
      hireDate,
      salary,
      staffRole,
    } = createStaffDto;
    const registerDto = {
      email,
      role,
      profile,
      address,
      contact,
      document,
      username,
      password,
      createdAt,
      refreshToken,
    };
    const createUser = await this.userService.register(registerDto);

    if (!createUser) {
      throw new Error('User creation failed.');
    }

    //create staff-specific details
    const newStaff = await this.staffRepository.create({
      user: createUser.user,
      hireDate,
      salary,
      staffRole,
    });
    await this.staffRepository.save(newStaff);

    return {
      message: 'Staff member created successfully',
      status: 200,
      staff: newStaff,
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
