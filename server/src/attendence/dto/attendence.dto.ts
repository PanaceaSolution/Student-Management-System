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
  @IsUUID()
  studentId: string;

  @IsUUID()
  @IsOptional()
  userId: string;

  @IsBoolean()
  isPresent: boolean;
}

export class CreateAttendanceDto {
  @IsUUID()
  classId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendenceRecordDto)
  attendances: AttendenceRecordDto[];
}
