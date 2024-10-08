import { IsString, IsOptional, IsEmail, IsEnum, IsInt, IsDate, IsNumber, IsNotEmpty, isNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateParentDto {
  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsNumber()
  @IsNotEmpty()
  loginId: number;

  // @IsNotEmpty()
  // students: string
}

export class UpdateParentDto {
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
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // @IsNotEmpty()
  // @IsOptional()
  // students: string
}
