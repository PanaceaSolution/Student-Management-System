import { BadRequestException, Injectable } from '@nestjs/common';
import { ParentDto } from './dto/parent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { User } from '../user/authentication/entities/authentication.entity';
import { ROLE } from '../utils/role.helper';
import { generateUsername } from '../utils/utils';
import { generateRandomPassword } from '../utils/utils';

@Injectable()
export class ParentService {
  private generateParentUsername(fname: string, lname: string): string {
    return generateUsername(fname, lname, ROLE.PARENT);
  }

  private generateParentPassword(): string {
    return generateRandomPassword();
  }
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createParent(
    createStudentDto: ParentDto,
  ): Promise<{ status: number; message: string; parent?: any; user?: any }> {
    const { fname, lname, email, gender, profilePicture } = createStudentDto;

    const parentExist = await this.parentRepository.findOne({
      where: {
        email,
      },
    });
    if (parentExist) {
      return { status: 400, message: 'Parent already exists in the database' };
    }

    const parent = this.parentRepository.create({
      fname,
      lname,
      gender,
      email,
    });
    await this.parentRepository.save(parent);
    const createdParent = await this.parentRepository.findOne({
      where: {
        id: parent.id,
      },
      relations: ['students'],
    });

    const parentName = this.generateParentUsername(fname, lname);

    const parentPassword = this.generateParentPassword();

    const user = this.userRepository.create({
      username: parentName,
      password: parentPassword,
      role: ROLE.PARENT,
      email: parent.email,
    });
    await this.userRepository.save(user);
    console.log(user);

    return {
      status: 201,
      message: 'Parent created successfully',
      parent: createdParent,
      user: user,
    };
  }
}

