import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsInt,
  IsDate,
  IsNotEmpty,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GENDER } from '../../utils/role.helper';
import { TRANSPORTATION_MODE } from '../../utils/role.helper';

export class StudentAddressDto {
  @IsString()
  wardNumber: string;

  @IsString()
  municipality: string;

  @IsString()
  province: string;

  @IsString()
  district: string;
}

export class StudentContactDto {
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  alternatePhoneNumber?: string;

  @IsOptional()
  @IsString()
  telephoneNumber?: string;
}

export class StudentDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  fname: string;

  @IsString()
  lname: string;

  @IsEmail()
  email: string;

  @IsString()
  studentClass: string;

  @IsString()
  section: string;

  @IsString()
  @IsOptional()
  bloodType: string;



  @ValidateNested()
  @Type(() => StudentAddressDto)
  address: StudentAddressDto;

  @ValidateNested()
  @Type(() => StudentContactDto)
  contact: StudentContactDto;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsEnum(TRANSPORTATION_MODE)
  @IsOptional()
  transportationMode:TRANSPORTATION_MODE;

  @IsString()
  rollNumber: string;

  @IsString()
  @IsOptional()
  registrationNumber: string;

  @IsString()
  @IsOptional()
  previousSchool: string;

  @IsUUID()
  parentId: number;

  @IsUUID()
  loginId: number;

  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  admissionDate?: Date;

  constructor() {
    if (!this.admissionDate) {
      this.admissionDate = new Date();
    }
  }
}

// export class UpdateStudentDto {
//   @IsOptional()
//   @IsString()
//   username?: string;

//   @IsOptional()
//   @IsString()
//   fname?: string;

//   @IsOptional()
//   @IsString()
//   lname?: string;

//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => AddressDto)
//   permanentAddress?: AddressDto;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => AddressDto)
//   temporaryAddress?: AddressDto;

//   @IsOptional()
//   @IsString()
//   father_name?: string;

//   @IsOptional()
//   @IsString()
//   mother_name?: string;

//   @IsOptional()
//   @IsEnum(Gender)
//   sex?: Gender;

//   @IsOptional()
//   @IsString()
//   bloodtype?: string;

//   @IsOptional()
//   @IsDate()
//   @Type(() => Date)
//   dob?: Date;

//   @IsOptional()
//   @IsDate()
//   @Type(() => Date)
//   admission_date?: Date;
// }

// export class FilterStudentDto {
//   @IsOptional()
//   @IsString()
//   name?: string; // This will be used for filtering by `fname` or `lname`

//   @IsOptional()
//   @IsEnum(Gender)
//   gender?: Gender; // Filtering by gender

//   @IsOptional()
//   @Type(() => Date)
//   createdAfter?: Date; // Start of createdAt range

//   @IsOptional()
//   @Type(() => Date)
//   createdBefore?: Date; // End of createdAt range
// }

// export class LinkParentDto {
//   @IsNotEmpty()
//   @IsInt()
//   parentId: number;

//   @IsNotEmpty()
//   @IsInt()
//   studentId: number;
// }
