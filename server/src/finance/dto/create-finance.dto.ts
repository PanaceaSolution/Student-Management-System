import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateFinanceDto {
  @IsNotEmpty({ message: 'Registration Fee is required' })
  @IsString()
  registrationFee: string;

  @IsNotEmpty({ message: 'Examination Fee is required' })
  @IsString()
  examinationFee: string;

  @IsNotEmpty({ message: 'Admission Fee is required' })
  @IsString()
  admissionFee: string;

  @IsNotEmpty({ message: 'Security Deposit is required' })
  @IsString()
  securityDeposite: string;

  @IsNotEmpty({ message: 'Other Charges are required' })
  @IsString()
  otherCharges: string;

  anualFee: string;

  monthlyFee: string;

  @IsOptional()
  @IsString()
  discount?: string;

  @IsNotEmpty({ message: 'Tax is required' })
  @IsString()
  tax: string;

  @IsOptional()
  @IsString()
  extraCharges?: string;

  @IsOptional()
  @IsString()
  total?: string;

  @IsOptional()
  @IsString()
  amountInWords?: string;

  @IsOptional()
  @IsString()
  agreementFile?: string;

  @IsOptional()
  @IsString()
  discritpion?: string;
}
