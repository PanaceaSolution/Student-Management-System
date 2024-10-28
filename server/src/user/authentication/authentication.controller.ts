import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { RegisterUserDto, LoginUserDto } from './dto/user.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() RegisterDto: RegisterUserDto) {
    return this.authenticationService.register(RegisterDto);
  }

  @Post('login')
  async login(@Body() LoginDto: LoginUserDto, @Res() res: Response) {
    return this.authenticationService.login(LoginDto, res);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response){
    return this.authenticationService.refreshToken(req, res)
  }

}