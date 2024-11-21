import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @IsNotEmpty()
  @IsString()
  courseDescription: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsUUID()
  teacherId: string;

  @IsBoolean()
  isCurrent?: boolean;
}
