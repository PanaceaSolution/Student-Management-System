import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { RegisterUserDto } from 'src/user/authentication/dto/register.dto';

export class ParentDto extends RegisterUserDto {
  @IsArray()
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === 'string' ? JSON.parse(value) : value),
    { toClassOnly: true },
  )
  @IsString({ each: true, message: 'Each child name must be a string' })
  childNames: string[];

  @IsArray()
  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === 'string' ? JSON.parse(value) : value),
    { toClassOnly: true },
  )
  @IsUUID('4', { each: true, message: 'Each student ID must be a valid UUID' })
  studentId?: string[];

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0];
  })
  @IsString()
  @IsNotEmpty({ message: 'Created date is required' })
  createdAt: string;
}
