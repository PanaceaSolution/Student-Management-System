import { IsString, IsOptional, IsUUID, IsArray, IsEnum } from 'class-validator';
import { STAFFROLE } from '../../utils/role.helper';

export class CreateClassDto {
  @IsString()
  className: string;

  @IsString()
  section: string;

  @IsOptional()
  @IsString()
  routineFile?: Express.Multer.File;

  @IsArray()
  @IsOptional()
  subject: string[];

  @IsUUID()
  classTeacherId: string;

  @IsEnum(STAFFROLE)
  staffRole: STAFFROLE = STAFFROLE.TEACHER;

  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  subjects: string[];
}