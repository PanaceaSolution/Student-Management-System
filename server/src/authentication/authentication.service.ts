import { Injectable, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../DB/prisma.service';

@Injectable()
export class AuthenticationService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(RegisterDto: RegisterDto) {
    try {
      const { username, password, role } = RegisterDto;

      if (!username || !password || !role) {
        return {
          message: 'You must have to fill all the above fields',
          status: 500,
          success: false,
        };
      }

      const UserCount = await this.prisma.login.count({
        where: {
          role: 'ADMIN',
        },
      });
      if (UserCount >= 10) {
        return {
          message: "You can't create user more than 1",
          status: 403,
          success: false,
        };
      }

      if (role !== 'ADMIN') {
        return {
          message: 'Only Admin can register',
          status: 403,
          success: false,
        };
      }
      const ExistingUser = await this.prisma.login.findUnique({
        where: { username },
      });

      if (ExistingUser) {
        return {
          message: 'User already exist',
          status: 409,
          success: false,
        };
      }

      const HashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.login.create({
        data: {
          username,
          password: HashedPassword,
          role,
        },
      });
      return {
        message: `User ${newUser.username} has been created`,
        user: {
          username: newUser.username,
          role: newUser.role,
        },
        success: true,
      };
    } catch (error) {
      return {
        message: error,
        status: 500,
      };
    }
  }

  async login(loginDto: LoginDto, @Res() res: Response) {
    const { username, password } = loginDto;

    try {
      if (!username || !password) {
        return res.status(401).json({
          message: 'Please fill both username and password',
          success: false,
        });
      }
      const user = await this.prisma.login.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          success: false,
        });
      } else if (user.role !== 'ADMIN' && user.role !== 'STUDENT') {
        return res.status(401).json({
          message: 'You are not authorized',
          success: false,
        });
      }
      let isPasswordValid = false;
      if (user.role === 'ADMIN') {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else if (user.role === 'STUDENT') {
        isPasswordValid = password === user.password;
      }

      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid password',
          success: false,
        });
      }

      // Only set the cookie if all validations pass
      const payload = { username: user.username, role: user.role };
      const AccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m', // short lifespan for access token
      });

      const RefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      res.cookie('accessToken', AccessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', RefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      await this.prisma.login.update({
        where: { username: user.username },
        data: { refreshToken: RefreshToken },
      });

      return res.status(200).json({ payload, success: true });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  }

  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({
        message: 'No refresh token is provided',
        success: false,
      });
    }

    try {
      const decoded = this.jwtService.verify(refreshToken);

      const payload = {
        username: decoded.username,
        role: decoded.role,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      return res.status(200).json({
        message: 'New access token generated',
        success: true,
      });
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid refresh token',
        success: false,
      });
    }
  }
}
