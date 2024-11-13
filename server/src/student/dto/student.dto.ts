import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsInt,
  IsDate,
  IsNotEmpty,
  ValidateNested,
  IsUUID,
  
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { GENDER } from '../../utils/role.helper';
import { TRANSPORTATION_MODE } from '../../utils/role.helper';
import { User } from '../../user/authentication/entities/authentication.entity';
import { RegisterUserDto } from '../../user/authentication/dto/register.dto';



export class StudentDto extends RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  studentClass: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsOptional()
  fatherName?: string;

  @IsString()
  @IsOptional()
  motherName?: string;

  @IsString()
  @IsOptional()
  guardianName?: string;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsEnum(TRANSPORTATION_MODE)
  @IsOptional()
  transportationMode?: TRANSPORTATION_MODE;

  @IsString()
  @IsNotEmpty()
  rollNumber: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  previousSchool?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string; 

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  admissionDate?: Date;

  @Transform(({ value }) => {
    return value ? new Date(value).toISOString().split('T')[0] : undefined;
  })
  @IsOptional()
  @IsString()
  formattedAdmissionDate?: string;
}

