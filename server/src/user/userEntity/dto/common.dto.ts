import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { GENDER } from '../../../utils/role.helper';

export class UserProfileDto {
  @IsString()
  @IsOptional()
  profilePicture: string;

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
  dob: Date;
}

export class UserAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Address line 1 is required' })
  addressType: string;

  @IsString()
  @IsNotEmpty({ message: 'wardNumber is required' })
  wardNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'municipality is required' })
  municipality: string;

  @IsString()
  @IsNotEmpty({ message: 'district is required' })
  district: string;

  @IsString()
  @IsNotEmpty({ message: 'province is required' })
  province: string;
}

export class UserContactDto {
  @IsString()
 @IsNotEmpty({ message: 'phoneNumber is required' })
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
  @IsNotEmpty({ message: 'documentName is required' })
  documentName: string;

  @IsString()
  @IsNotEmpty({ message: 'documentFile is required' })
  documentFile: string;
}
