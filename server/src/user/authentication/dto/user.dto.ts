// src/auth/dto/register.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ROLE } from '../../../utils/role.helper';
import {
  UserProfileDto,
  UserAddressDto,
  UserContactDto,
  UserDocumentsDto,
} from '../../userEntity/dto/common.dto';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ROLE)
  @IsNotEmpty()
  role: ROLE; //register user role= admin

  @IsString()
  @IsOptional()
  refreshToken: string;

  @ValidateNested()
  @Type(() => UserProfileDto)
  profile: UserProfileDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UserAddressDto)
  address: UserAddressDto[];

  @ValidateNested()
  @Type(() => UserContactDto)
  contact: UserContactDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UserDocumentsDto)
  document: UserDocumentsDto;

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'
  })
  createdAt: string;
}

export class LoginUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
