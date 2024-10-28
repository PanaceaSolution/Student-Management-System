// src/auth/dto/register.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ROLE } from '../../utils/role.helper';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: ROLE; // Add 'ADMIN', 'USER', etc.
}
