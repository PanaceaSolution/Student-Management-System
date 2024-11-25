import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Response, Request } from 'express';
import { RefreshToken } from 'src/user/userEntity/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';


@Injectable()
export class FullAuthService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) { }


  createPayload(user: {id:UUID; username: string; role: string }): object {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }

  isTokenValid(token: string): any {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

  }

  async generateTokensAndAttachCookies(
    res: Response,
    payload: object,
    userId: string,
    deviceInfo?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
  
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });
  
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
  
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  
    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId,
      refreshToken,
      // : hashedRefreshToken, // Store the hashed token in the DB
      expiresAt,
      deviceInfo: deviceInfo && Array.isArray(deviceInfo) ? deviceInfo : ['Unknown Device'], 
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);
  
    // Send the plain refresh token in the cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  
    return { accessToken, refreshToken }; // Return plain token
  }
  

  clearCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  async refreshTokens(req: Request, res: Response): Promise<any> {
    const refreshToken = req.cookies?.refreshToken;
  
    if (!refreshToken) {
      return {
        message: 'No refresh token provided',
        success: false,
        status: 403,
      };
    }
  
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { refreshToken }, // Compare directly with the plain token
    });
  
    if (!storedToken) {
      return {
        message: 'Invalid refresh token',
        success: false,
        status: 401,
      };
    }
  
    const now = new Date();
    const cooldownPeriod = 60 * 1000; // 1-minute cooldown
    if (now.getTime() - storedToken.lastUsedAt?.getTime() < cooldownPeriod) {
      return {
        message: 'Too many requests',
        success: false,
        status: 429,
      };
    }
  
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
  
      const payload = this.createPayload(decoded);
  
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      });
  
      storedToken.lastUsedAt = now;
      await this.refreshTokenRepository.save(storedToken);
  
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
  
      return {
        message: 'New access token generated',
        success: true,
        status: 200,
      };
    } catch {
      return {
        message: 'Invalid refresh token',
        success: false,
        status: 401,
      };
    }
  }
  
  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
      const userId = decoded.id;
  
      const storedToken = await this.refreshTokenRepository.findOne({ where: { refreshToken } });
  
      if (!storedToken) {
        console.error('No refresh token found for userId:', userId);
        return;
      }
  
      await this.refreshTokenRepository.delete({ refreshToken });
    } catch (error) {
      throw new Error('Failed to invalidate refresh token');
    }
  }
  

  async getUserSessions(userId: string) {
    const sessions = await this.refreshTokenRepository.find({
      where: { userId },
      select: ['deviceInfo', 'expiresAt'],
    });

    return {
      userId,
      sessions,
    };
  }

  async terminateSession(userId: string, deviceInfo: string): Promise<void> {
    await this.refreshTokenRepository.delete({ userId, deviceInfo });
  }

  async terminateAllSessions(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }

  async deleteExpiredTokens(): Promise<void> {
    try {
      const now = new Date();
      const result = await this.refreshTokenRepository.delete({ expiresAt: LessThan(now) });
    } catch (error) {
      console.error('Error deleting expired tokens:', error.message);
    }
  }
  async getRefreshTokenByUserId(userId: string): Promise<RefreshToken | null> {
    try {
      return await this.refreshTokenRepository.findOne({
        where: { userId },
        select: ['refreshToken', 'expiresAt'], // Ensure the plain token is retrievable
      });
    } catch (error) {
      console.error('Error fetching refresh token:', error.message);
      throw new InternalServerErrorException('Failed to fetch refresh token');
    }
  }
}
//csrf & xss protection left