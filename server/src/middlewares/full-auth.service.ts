import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Injectable()
export class FullAuthService {
  constructor(private readonly jwtService: JwtService) {}

  createPayload(user: { username: string; role: string }): object {
    return {
      username: user.username,
      role: user.role,
    };
  }

  async generateTokensAndAttachCookies(
    res: Response,
    payload: object,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

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

  clearCookies(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  isTokenValid(token: string): any {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async refreshTokens(req: Request, res: Response): Promise<any> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return {
        message: 'No refresh token provided',
        success: false,
        status: 403,
      };
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const payload = this.createPayload(decoded);

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET,
      });

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
    } catch (error) {
      return {
        message: 'Invalid refresh token',
        success: false,
        status: 401,
      };
    }
  }
}
