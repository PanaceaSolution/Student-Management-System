import { Type } from 'class-transformer';
import { IsUUID, IsDateString, IsBoolean, ValidateNested, IsArray, IsString } from 'class-validator';

export class AttendenceRecordDto {
  @IsUUID()
  studentId:string;

  @IsBoolean()
  isPresent:boolean;
}

export class CreateAttendanceDto {
  
  @IsUUID()
  classId: string;


  @IsArray()
  @ValidateNested({each:true})
  @Type(()=>AttendenceRecordDto)
  attendances:AttendenceRecordDto[];
}
