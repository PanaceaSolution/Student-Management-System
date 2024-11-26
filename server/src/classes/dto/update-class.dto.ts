import { IsString, IsOptional, IsUUID, IsArray, IsEnum } from 'class-validator';
import { STAFFROLE } from '../../utils/role.helper';

export class UpdateClassDto {
  @IsString()
  className: string;

  @IsString()
  section: string;

  @IsArray()
  @IsOptional()
  subject: string[];

  @IsOptional()
  @IsString()
  routineFile?: Express.Multer.File;

  @IsUUID()
  classTeacherId: string;

  @IsEnum(STAFFROLE)
  staffRole: STAFFROLE = STAFFROLE.TEACHER;

  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  subjects: string[];
}