import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.accessToken; //you can either use authorization header tooo.
      if (!token) {
        return res.status(401).json({
          message: 'Access Token Missing',
          success: false,
        });
      }
      const decoded = this.jwtService.verify(token);
      if(decoded.role !== 'ADMIN'){
        return res.status(403).json({
          message:"Only Admin can Access",
          success:false,
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid or expired access token',
        success: false,
      });
    }
  }
}
