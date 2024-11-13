import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RegisterUserDto } from '../../user/authentication/dto/register.dto';
import { STAFFROLE } from '../../utils/role.helper';

export class StaffDto extends RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Hire date is required' })
  hireDate: string;

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
