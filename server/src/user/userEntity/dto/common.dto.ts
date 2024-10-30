import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { GENDER } from '../../../utils/role.helper';

export class UserProfileDto {
  @IsString()
  @IsOptional()
  profilePicture: string;

  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: GENDER;

  @IsNotEmpty()
  dob: Date;
}

export class UserAddressDto {
  @IsString()
  @IsNotEmpty()
  addressType: string;

  @IsString()
  @IsOptional()
  wardNumber: string;

  @IsString()
  @IsNotEmpty()
  municipality: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  province: string;
}

export class UserContactDto {
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  alternatePhoneNumber: string;

  @IsString()
  @IsOptional()
  telephoneNumber: string;
}

export class UserDocumentsDto {
  @IsString()
  @IsNotEmpty()
  documentName: string;

  @IsString()
  @IsNotEmpty()
  documentFile: string;
}
