import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Query,
  Param,
  Req,
  Res,
  UseGuards,
  Patch,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
  Delete,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ROLE, STAFFROLE } from 'src/utils/role.helper';
import { AuthGuard } from '../../middlewares/auth.guard';


@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  async register(
    @Body() body: RegisterUserDto,  
    @UploadedFiles()
    files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] },
  ) {
    try {
      // console.log('Parsed and Validated Register DTO:', body);
      return this.authenticationService.register(body, files);
    } catch (error) {
      console.error('Error parsing JSON strings in form-data:', error);
      throw new BadRequestException('Invalid JSON format for nested objects');
    }
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authenticationService.login(loginDto, res);
  }

  @Post('logout')
  async logout(@Req() request: Request, @Body('userId') userId: UUID, @Res() res: Response) {
    return this.authenticationService.logout(res, userId);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authenticationService.refreshToken(req, res);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  async updateUser(
    @Param('id') id: UUID,
    @Body() updateUserDto: Partial<RegisterUserDto>,
    @UploadedFiles()
    files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] } = {},
  ) {
    try {
      // console.log('UpdateUser DTO:', updateUserDto);
      // console.log('Received files for update:', files);
      return this.authenticationService.updateUser(id, updateUserDto, files);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Invalid data for user update');
    }
  }

  @Get('all')
  @UseGuards(AuthGuard)
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
    @Query('searchBy') searchBy: 'name' | 'role' | 'email' | 'username',
  ) {
    return this.authenticationService.searchUser(searchTerm, searchBy);
  }

  @Delete('delete')
  async deleteUsers(@Body('userIds') userIds: UUID[]) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new BadRequestException('userIds must be a non-empty array');
    }
    return await this.authenticationService.deleteUsers(userIds);
  }
  @Get('user/:id')
  @UseGuards(AuthGuard)
  async getSingleUser(@Param('id') id: UUID) {
    try {
      return await this.authenticationService.getSingleUser(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          message: 'An error occurred while fetching the user',
          status: 500,
          success: false,
        });
      
      }
    }
  }
    @Get('users/role')
  async getUsersByRole(
    @Query('role') role: ROLE,
    @Query('staffRole') staffRole?: STAFFROLE,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 8
  ) {
    try {
      return await this.authenticationService.getUsersByRole(role, staffRole, page, limit);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          message: 'An error occurred while fetching users by role',
          status: 500,
          success: false,
        });
      }
    }
  }
  @Patch('deactivate')
  @UseGuards(AuthGuard)
  async deactivateUsers(@Body('userIds') userIds: UUID[]) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new BadRequestException('userIds must be a non-empty array');
    }
    return await this.authenticationService.deactivateUsers(userIds);
  }
}
