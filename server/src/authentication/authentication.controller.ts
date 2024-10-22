import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() RegisterDto: RegisterDto) {
    return this.authenticationService.register(RegisterDto);
  }

  @Post('login')
  async login(@Body() LoginDto: LoginDto, @Res() res: Response) {
    return this.authenticationService.login(LoginDto, res);
  }
}
