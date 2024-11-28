import { Type } from 'class-transformer';
import {
  IsUUID,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsString,
  IsOptional,
} from 'class-validator';

export class StudentAttendanceDto {
  @IsString()
  rollNumber: string;

  @IsString()
  fname: string;

  @IsString()
  lname: string;

  @IsString()
  isPresent: string[];
}

export class CreateAttendanceDto {
  @IsString()
  className: string;

  @IsString()
  section: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  students: StudentAttendanceDto[];
}
