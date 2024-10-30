import { Body, Controller, Post, Get, Put, Query, Param, Req, Res, Patch } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authenticationService.login(loginDto, res);
  }

  @Post('logout')
  async logout(@Req() request: Request, userId:UUID, @Res() res: Response) {
    return this.authenticationService.logout(res, userId);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authenticationService.refreshToken(req, res);
  }

  @Patch('update/:id')
  async updateUser(
    @Param('id') id: UUID,
    @Body() updateUserDto: Partial<RegisterUserDto>
  ) {
    return this.authenticationService.updateUser(id, updateUserDto);
  }
  @Get('all')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;

    return this.authenticationService.getAllUsers(pageNumber, limitNumber);
  }

  @Get('search')
  async searchUser(
    @Query('search') searchTerm: string,
    @Query('searchBy') searchBy: 'name' | 'role' | 'email' | 'username'
  ) {
    return this.authenticationService.searchUser(searchTerm, searchBy);
  }
}
