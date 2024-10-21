import { IsString, IsOptional } from 'class-validator';

export class CreateClassDto {
  @IsString()
  className: string;
}

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  className?: string;
}
