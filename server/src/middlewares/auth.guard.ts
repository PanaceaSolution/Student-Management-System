import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FullAuthService } from './full-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly fullAuthService: FullAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.accessToken; 
console.log(token)
    if (!token) {
      throw new UnauthorizedException('Authentication Invalid: No access token found');
    }

    try {
      const user = this.fullAuthService.isTokenValid(token);
      request.user = user; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication Invalid: Invalid token');
    }
  }
}
