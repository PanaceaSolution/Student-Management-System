import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user || !this.roles.includes(user.role)) {
      throw new ForbiddenException('Unauthorized to access this route');
    }

    return true;
  }
}

export const AuthorizeRoles = (...roles: string[]) => {
  return new RolesGuard(roles);
};
