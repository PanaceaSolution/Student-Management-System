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
import { Type, Transform } from 'class-transformer';
import { GENDER } from '../../utils/role.helper';
import { TRANSPORTATION_MODE } from '../../utils/role.helper';
import { User } from '../../user/authentication/entities/authentication.entity';
import { RegisterUserDto } from '../../user/authentication/dto/register.dto';

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

export class StudentDto extends RegisterUserDto  {
  @IsString()
  studentClass: string;

  @IsString()
  section: string;

  @IsString()
  @IsOptional()
  fatherName: string;

  @IsString()
  @IsOptional()
  motherName: string;

  @IsString()
  @IsOptional()
  guardianName: string;

  @IsString()
  @IsOptional()
  religion:string;

  @IsString()
  @IsOptional()
  bloodType: string;

  @IsEnum(TRANSPORTATION_MODE)
  @IsOptional()
  transportationMode: TRANSPORTATION_MODE;

  @IsString()
  rollNumber: string;

  @IsString()
  @IsOptional()
  registrationNumber: string;

  @IsString()
  @IsOptional()
  previousSchool: string;

  @IsUUID()
  @IsOptional()
  parentId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  admissionDate?: Date; 

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'
  })
  createdAt: string;

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
