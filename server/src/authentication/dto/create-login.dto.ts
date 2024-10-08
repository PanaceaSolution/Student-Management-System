// src/login/dto/create-login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

// DTO for creating a new login
export class CreateLoginDto {

  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

// DTO for connecting to an existing login
export class ConnectLoginDto {
  @IsNotEmpty()
  id: number; // Connecting by existing login ID
}
