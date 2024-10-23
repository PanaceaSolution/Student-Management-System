import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  IsEnum,
} from 'class-validator';
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
export class CreateStaffDto {
  @IsString()
  @IsOptional()
  username: string; // Unique username for the staff member

  @IsString()
  @IsNotEmpty()
  fname: string; // First name of the staff member

  @IsString()
  @IsNotEmpty()
  lname: string; // Last name of the staff member

  @IsString()
  @IsOptional()
  profilePicture?: string; // URL or path to the staff member's profile picture

  @IsString()
  @IsNotEmpty()
  address: string; // Residential address of the staff member

  @IsString()
  @IsNotEmpty()
  phoneNumber: string; // Phone number of the staff member

  @IsEnum(Gender)
  @IsNotEmpty()
  sex: Gender; // Gender of the staff member

  @IsString()
  @IsNotEmpty()
  bloodType: string; // Blood type of the staff member

  @IsEmail()
  @IsNotEmpty()
  email: string; // Email address of the staff member

  @IsString()
  @IsNotEmpty()
  role: string; // Job role of the staff member

  @IsNumber()
  @IsNotEmpty()
  salary: number; // Salary of the staff member

  // Enhanced DOB validation using a custom decorator or helper function
  @IsString()
  @IsNotEmpty()
  dob: string; // Date of birth in YYYY-MM-DD format

}

// Custom decorator or helper function for date validation (example)
function IsValidDate(value: string) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return false;
  }

  const date = new Date(value); // Attempt to create a valid Date object
  return !isNaN(date.getTime()); // Check if the date is valid
}