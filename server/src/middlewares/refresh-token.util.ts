import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { FullAuthService } from './full-auth.service';

@Injectable()
export class RefreshTokenUtil {
  constructor(private readonly fullAuthService: FullAuthService) {}

  async refreshToken(req: Request, res: Response) {
    try {
      const result = await this.fullAuthService.refreshTokens(req, res);
      if (!result.success) {
        return res.status(result.status).json({
          message: result.message,
          success: false,
        });
      }
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
