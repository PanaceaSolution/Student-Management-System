import {
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from '../../user/authentication/dto/user.dto';
import { STAFFROLE } from '../../utils/role.helper';
import { Transform, Type } from 'class-transformer';

export class CreateStaffDto extends RegisterUserDto {
  
  // Staff-specific fields
  @IsString()
  hireDate: string;

  @IsString()
  salary: string;

  @IsString()
  staffRole: STAFFROLE;

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'
  })
  createdAt: string;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}
