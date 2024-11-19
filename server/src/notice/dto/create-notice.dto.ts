import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoticeDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional() 
    @IsString()
    filePath?: string; 
}