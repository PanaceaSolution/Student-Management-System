import { Body, Controller, Post, Get, Put, Query, Param, Req, Res, Patch, BadRequestException, UploadedFiles } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { memoryStorage } from 'multer';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}
  @Post('upload-multiple-files')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() })) // Limit to 10 files
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      console.log("No files received in controller");
      throw new BadRequestException('No files provided');
    }
    console.log("Files received in controller:", files);
    return this.authenticationService.uploadMultipleFiles(files);
  }
  @Patch('update-profile-picture')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('oldPublicId') oldPublicId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.authenticationService.updateProfilePicture(file, oldPublicId);
  }

  @Patch('update-multiple-files')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() }))
  async updateMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('oldPublicIds') oldPublicIds: string[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    return this.authenticationService.updateMultipleFiles(files, oldPublicIds);
  }

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

