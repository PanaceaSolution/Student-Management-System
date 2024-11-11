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
  Patch,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

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
    @Body() body: any,
    @UploadedFiles()
    files: { profilePicture?: Express.Multer.File[]; documents?: Express.Multer.File[] },
  ) {
    try {
      const registerDto: RegisterUserDto = {
        email: body.email,
        password: body.password,
        role: body.role,
        profile: JSON.parse(body.profile),
        contact: JSON.parse(body.contact),
        address: JSON.parse(body.address),
        document: JSON.parse(body.document),
        username: body.username || '',
        refreshToken: body.refreshToken || null,
        createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      };

      console.log('Parsed Register DTO:', registerDto);
      console.log('Received files:', files);

      return this.authenticationService.register(registerDto, files);
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
      console.log('UpdateUser DTO:', updateUserDto);
      console.log('Received files for update:', files);
      return this.authenticationService.updateUser(id, updateUserDto, files);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Invalid data for user update');
    }
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
    @Query('searchBy') searchBy: 'name' | 'role' | 'email' | 'username',
  ) {
    return this.authenticationService.searchUser(searchTerm, searchBy);
  }



  // @Patch('deactivate/:id')
  // async deactivateUser(@Param('id') id: UUID) {
  //   return this.authenticationService.deactivateUser(id);
  // }
}
// function UseInterceptors(interceptor: any) {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     Reflect.defineMetadata('interceptors', interceptor, target, propertyKey);
//   };
// }
// function UseInterceptors(arg0: any): (target: AuthenticationController, propertyKey: "uploadProfilePicture", descriptor: TypedPropertyDescriptor<(file: Express.Multer.File) => Promise<any>>) => void | TypedPropertyDescriptor<...> {
//   throw new Error('Function not implemented.');
// }

