import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  sex: string;

  @IsString()
  @IsNotEmpty()
  bloodType: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @IsNotEmpty()
  salary: number;
  
  @IsDateString() // Validate that the string is a valid date
  @IsNotEmpty()
  dob: Date; // Add the dob field as Date type

  login?: {
    create?: {
      username: string;
      password: string;
      role: string;
    };
    connect?: {
      id: number; // Assuming you're connecting to an existing login by ID
    };
  };
}
