
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested, IsString, IsArray, IsObject, IsOptional } from 'class-validator';
import { RegisterUserDto } from 'src/user/authentication/dto/register.dto';

export class ParentDto extends RegisterUserDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value), { toClassOnly: true })
  childNames: string[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value), { toClassOnly: true })
  studentId? : string[];

  @Transform(({ value }) => {
    const date = value ? new Date(value) : new Date();
    return date.toISOString().split('T')[0];
  })
  createdAt: string;
}
