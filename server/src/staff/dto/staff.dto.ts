// src/staff/dto/staff.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { RegisterUserDto } from '../../user/authentication/dto/register.dto'; // Adjust path as necessary
import { STAFFROLE } from '../../utils/role.helper';

export class StaffDto extends RegisterUserDto {
  @IsDate()
  @IsNotEmpty({ message: 'Hire date is required' })
  hireDate: Date;

  @IsString()
  @IsNotEmpty({ message: 'Salary is required' })
  salary: string;

  @IsEnum(STAFFROLE, { message: 'Invalid staff role' })
  @IsNotEmpty({ message: 'Staff role is required' })
  staffRole: STAFFROLE;

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0];
  })
  createdAt: string;
}
