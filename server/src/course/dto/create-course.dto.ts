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

  @IsOptional()
  file?: string;
}