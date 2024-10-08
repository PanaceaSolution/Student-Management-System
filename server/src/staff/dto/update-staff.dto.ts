import { IsString,IsNotEmpty, IsOptional, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  fname?: string;

  @IsOptional()
  @IsString()
  lname?: string;

  @IsString()
  @IsNotEmpty()
  dob: string; // Use IsDateString to ensure it's a valid date format

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  // If you're allowing updates to the associated login record, use the appropriate validation
  @IsOptional()
  @IsNumber()
  loginId?: number; // Assuming this is the foreign key ID for the login relationship
}
