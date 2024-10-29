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
  @IsNotEmpty({message: 'First name is required'})
  fname: string;

  @IsString()
  @IsNotEmpty({message: 'Last name is required'})
  lname: string;

  @IsEmail()
  @IsNotEmpty({message: 'Email is required'})
  email: string;

  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: GENDER;


  @IsString()
  @IsOptional()
  profilePicture: string;


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
