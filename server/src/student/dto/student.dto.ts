import { IsString, IsOptional, IsEmail, IsEnum, IsInt, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
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

  @IsString()
  address: string;

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
  @IsString()
  address?: string;

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
}

export class LinkParentDto {
  @IsNotEmpty()
  @IsInt()
  parentId?: number
  
  @IsNotEmpty()
  @IsInt()
  studentId?: number
}