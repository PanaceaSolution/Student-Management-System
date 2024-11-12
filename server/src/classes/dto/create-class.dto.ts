import { IsString, IsOptional, IsUUID, IsArray, IsEnum } from 'class-validator';
import { STAFFROLE } from '../../utils/role.helper';

export class CreateClassDto {
  @IsString()
  className: string;

  @IsString()
  section: string;

  @IsOptional()
  @IsString()
  routineFile?: string;

  @IsUUID()
  classTeacherId: string;

  @IsEnum(STAFFROLE)
  staffRole: STAFFROLE = STAFFROLE.TEACHER; 

  @IsArray()
  @IsUUID("all", { each: true })
  subjects: string[];
}