import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsBoolean,
  IsOptional,
  isString,
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

  @IsString()
  fname:string;

  @IsString()
  lname:string;



}
