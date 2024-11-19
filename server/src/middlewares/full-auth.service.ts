import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Response, Request } from 'express';
import { RefreshToken } from 'src/user/userEntity/refresh-token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FullAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  createPayload(user: { username: string; role: string }): object {
    return {
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
      refreshToken: hashedRefreshToken,
      expiresAt,
      deviceInfo: deviceInfo || 'Unknown Device',
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

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

    return { accessToken, refreshToken };
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
      where: { userId: req.body.userId },
    });

    if (!storedToken) {
      return {
        message: 'Invalid refresh token',
        success: false,
        status: 401,
      };
    }

    const isTokenValid = await bcrypt.compare(refreshToken, storedToken.refreshToken);
    if (!isTokenValid) {
      return {
        message: 'Invalid refresh token',
        success: false,
        status: 401,
      };
    }

    const now = new Date();
    const cooldownPeriod = 60 * 1000; 
    if (now.getTime() - storedToken.lastUsedAt.getTime() < cooldownPeriod) {
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
    const hashedTokens = await this.refreshTokenRepository.find();
    for (const tokenEntity of hashedTokens) {
      const isMatch = await bcrypt.compare(refreshToken, tokenEntity.refreshToken);
      if (isMatch) {
        await this.refreshTokenRepository.delete({ id: tokenEntity.id });
        break;
      }
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
    const now = new Date();
    await this.refreshTokenRepository.delete({ expiresAt: LessThan(now) });
  }
}
//csrf & xss protection left