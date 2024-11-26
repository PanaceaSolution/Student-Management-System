import { IsString, IsOptional, IsUUID, IsArray, IsEnum } from 'class-validator';
import { STAFFROLE } from '../../utils/role.helper';

export class UpdateClassDto {
  @IsString()
  className: string;

  @IsString()
  section: string;

  @IsOptional()
  @IsString()
  routineFile?: Express.Multer.File;

  @IsUUID()
  classTeacherId: string;

  @IsEnum(STAFFROLE)
  staffRole: STAFFROLE = STAFFROLE.TEACHER; 

  @IsArray()
  @IsUUID("all", { each: true })
  subjects: string[];

  @IsArray()
  subject: string[];
}