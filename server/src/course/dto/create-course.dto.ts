import { IsNotEmpty, IsString, IsUUID, IsDate, IsBoolean } from 'class-validator';

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

  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

  @IsBoolean()
  isCurrent?: boolean;
}