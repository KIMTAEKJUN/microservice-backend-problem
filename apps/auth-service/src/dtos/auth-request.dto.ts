import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRegisterRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;
}

export class UserLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
