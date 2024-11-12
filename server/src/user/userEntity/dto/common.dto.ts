import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { GENDER } from '../../../utils/role.helper';
import { Type, Transform } from 'class-transformer';
import { Express } from 'express';

export class UserProfileDto {
  @IsOptional()
  profilePicture: string; // Allows file or URL as a string

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  fname: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lname: string;

  @IsEnum(GENDER)
  @IsNotEmpty({ message: 'Gender is required' })
  gender: GENDER;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0];
  })
  dob: Date;
}

export class UserAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Address type is required' })
  addressType: string;

  @IsString()
  @IsNotEmpty({ message: 'Ward number is required' })
  wardNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Municipality is required' })
  municipality: string;

  @IsString()
  @IsNotEmpty({ message: 'District is required' })
  district: string;

  @IsString()
  @IsNotEmpty({ message: 'Province is required' })
  province: string;
}

export class UserContactDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  alternatePhoneNumber?: string;

  @IsString()
  @IsOptional()
  telephoneNumber?: string;
}

export class UserDocumentsDto {
  @IsString()
  @IsNotEmpty({ message: 'Document name is required' })
  documentName: string;

  @IsNotEmpty({ message: 'Document file is required' })
  documentFile: string ; // Allows file or URL as a string
}
