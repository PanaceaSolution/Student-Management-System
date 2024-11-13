import { IsUUID, IsString, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAssignmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsUUID()
  courseId: string;

  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  submissionDate?: Date;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  teacherFile?: Express.Multer.File;

  @IsOptional()
  @IsString()
  studentFile?: string;
}
