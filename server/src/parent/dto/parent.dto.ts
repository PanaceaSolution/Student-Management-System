import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsInt,
  IsDate,
  IsNumber,
  IsNotEmpty,
  isNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GENDER } from '../../utils/role.helper';

export class ParentDto {
  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: GENDER;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  profilePicture: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // @IsNotEmpty()
  // students: string
}

// export class UpdateParentDto {
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
//   @IsString()
//   phoneNumber?: string;

//   @IsOptional()
//   @IsString()
//   address?: string;

//   // @IsNotEmpty()
//   // @IsOptional()
//   // students: string
// }
