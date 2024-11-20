import { IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';

export class CreateCourseEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsBoolean()
  isCurrent?: boolean;
}