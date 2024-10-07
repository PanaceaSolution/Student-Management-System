import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/DB/prisma.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(RegisterDto: RegisterDto) {
    const { username, password, role } = RegisterDto;
    // console.log(username, password, role); correct

    const ExistingUser = await this.prisma.login.findUnique({
      where: { username }, // This should work if username is unique
    });

    if (ExistingUser) {
      throw new Error('Username is already taken');
    }

    const HashedPassword = await bcrypt.hash(password, 10);

    const NewUser = await this.prisma.login.create({
      data: {
        username,
        password: HashedPassword,
        role,
      },
    });
    return {
      message: `User ${NewUser.username} has been created`,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.prisma.login.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error('User not found');
    } else if (user.role !== 'ADMIN') {
      throw new Error('User not authorized');
    }

    const IsPasswordValid = await bcrypt.compare(password, user.password);
    if (!IsPasswordValid) {
      throw new Error('Invalid password');
    }
    const payload = { username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);
    // console.log(token);

    return token;
  }
}
