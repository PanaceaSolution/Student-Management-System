// src/auth/dto/register.dto.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ROLE } from '../../../utils/role.helper';
import { Transform, Type } from 'class-transformer';
import {
  UserAddressDto,
  UserContactDto,
  UserDocumentsDto,
  UserProfileDto,
} from '../../userEntity/dto/common.dto';
export class RegisterUserDto {


  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsEnum(ROLE)
  @IsNotEmpty({ message: 'Role is required' })
  role: ROLE;

  @IsString()
  @IsOptional({ message: 'Refresh token is required' })
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
  @Type(() => UserDocumentsDto)
  document: UserDocumentsDto[] = [];

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'
  })
  createdAt: string;
}
