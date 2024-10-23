import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsInt,
  IsDate,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class AddressDto {
  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  state: string;

  @IsString()
  villageName: string;

  @IsString()
  postalcode: string;
}

export class CreateStudentDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  fname: string;

  @IsString()
  lname: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  permanentAddress: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  temporaryAddress: AddressDto;

  @IsInt()
  addressId: number;

  @IsEnum(Gender)
  sex: Gender;

  @IsString()
  bloodtype: string;

  @IsInt()
  parentId: number;

  @IsInt()
  classId: number;

  @IsInt()
  loginId: number;

  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsOptional()
  @IsString()
  father_name?: string;

  @IsOptional()
  @IsString()
  mother_name?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  admission_date?: Date;

  constructor() {
    if (!this.admission_date) {
      this.admission_date = new Date();
    }
  }
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  fname?: string;

  @IsOptional()
  @IsString()
  lname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  permanentAddress?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  temporaryAddress?: AddressDto;

  @IsOptional()
  @IsString()
  father_name?: string;

  @IsOptional()
  @IsString()
  mother_name?: string;

  @IsOptional()
  @IsEnum(Gender)
  sex?: Gender;

  @IsOptional()
  @IsString()
  bloodtype?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dob?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  admission_date?: Date;
}

export class FilterStudentDto {
  @IsOptional()
  @IsString()
  name?: string; // This will be used for filtering by `fname` or `lname`

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender; // Filtering by gender

  @IsOptional()
  @Type(() => Date)
  createdAfter?: Date; // Start of createdAt range

  @IsOptional()
  @Type(() => Date)
  createdBefore?: Date; // End of createdAt range
}

export class LinkParentDto {
  @IsNotEmpty()
  @IsInt()
  parentId: number;

  @IsNotEmpty()
  @IsInt()
  studentId: number;
}
