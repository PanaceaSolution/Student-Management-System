import { IsNotEmpty, IsString, IsUUID, IsDate, IsBoolean } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @IsNotEmpty()
  @IsString()
  courseDescription: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

  @IsBoolean()
  isCurrent?: boolean;
}