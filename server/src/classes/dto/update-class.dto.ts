import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  className?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsString()
  routineFile?: string;

  @IsOptional()
  @IsUUID()
  classTeacherId?: string;

  
  @IsArray()
  @IsUUID("all", { each: true })
  subjects?: string[];
}