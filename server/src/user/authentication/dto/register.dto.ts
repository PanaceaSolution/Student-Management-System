import { IsString, IsOptional, IsNotEmpty, IsEmail, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { ROLE } from '../../../utils/role.helper';
import { Type, Transform } from 'class-transformer';
import { UserAddressDto, UserContactDto, UserDocumentsDto, UserProfileDto } from '../../userEntity/dto/common.dto';

export class RegisterUserDto {
  @IsString()
  password: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsEnum(ROLE)
  @IsNotEmpty({ message: 'Role is required' })
  role: ROLE;

  @IsString()
  @IsOptional()
  refreshToken: string;

  @ValidateNested()
  @Type(() => UserProfileDto)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value), { toClassOnly: true })
  profile: UserProfileDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UserAddressDto)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value), { toClassOnly: true })
  address: UserAddressDto[];

  @ValidateNested()
  @Type(() => UserContactDto)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value), { toClassOnly: true })
  contact: UserContactDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UserDocumentsDto)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value), { toClassOnly: true })
  document: UserDocumentsDto[];

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0];
  })
  createdAt: string;
}
