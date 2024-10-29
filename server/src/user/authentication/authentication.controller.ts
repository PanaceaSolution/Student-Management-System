import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { Response,Request } from 'express';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() RegisterDto: RegisterUserDto) {
    return this.authenticationService.register(RegisterDto);
  }

  @Post('login')
  async login(@Body() LoginDto: LoginDto, @Res() res: Response) {
    return this.authenticationService.login(LoginDto, res);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authenticationService.refreshToken(req, res);
  }
}