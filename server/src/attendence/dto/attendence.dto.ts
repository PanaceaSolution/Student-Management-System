import { Type } from 'class-transformer';
import {
  IsUUID,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsString,
  IsOptional,
} from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class AttendenceRecordDto {
  // @IsString()
  // className:string;
  // @IsString()
  // section:string;
}

export class CreateAttendanceDto {
  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsArray()
  classId?: string[];

  @IsOptional()
  @IsString()
  className: string;

  @IsOptional()
  @IsString()
  section: string;
}
