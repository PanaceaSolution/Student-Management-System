import { IsOptional, IsString, IsBoolean ,IsDate} from 'class-validator';

export class CreateFeeDto {
  
  @IsString()
  amount: string;

  @IsString()
  tax: string;

  @IsString()
  extraCharges: string;

  @IsString()
  discount: string;

  @IsString()
  fine: string;

  @IsString()
  total: string;

  @IsString()
  priceInWords: string;

  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsDate()
  paymentDate?: Date;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;  // Defaults to false in the Prisma model
}


export class UpdateFeeDto {

  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  tax?: string;

  @IsOptional()
  @IsString()
  extraCharges?: string;

  @IsOptional()
  @IsString()
  discount?: string;

  @IsOptional()
  @IsString()
  fine?: string;

  @IsOptional()
  @IsString()
  total?: string;

  @IsOptional()
  @IsString()
  priceInWords?: string;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsDate()
  paymentDate?: Date;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;
}