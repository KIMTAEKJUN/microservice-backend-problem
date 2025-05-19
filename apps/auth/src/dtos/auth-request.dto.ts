import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'libs/database/enums/user.enum';

export class UserRegisterRequestDto {
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
  @MaxLength(10, { message: '이름은 최대 10자 이하여야 합니다.' })
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  name: string;

  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  password: string;
}

export class UserLoginRequestDto {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  password: string;
}

export class GetUsersRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsOptional()
  email?: string;

  @IsEnum(UserRole, { message: '올바른 역할을 선택해주세요.' })
  @IsOptional()
  role?: UserRole;
}

export class UpdateUserRoleRequestDto {
  @IsEnum(UserRole, { message: '올바른 역할을 선택해주세요.' })
  @IsNotEmpty({ message: '역할은 필수 입력 항목입니다.' })
  role: UserRole;
}
