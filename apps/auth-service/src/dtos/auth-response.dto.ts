import { User } from 'libs/database/schemas/user.schema';

export class UserRegisterResponseDto {
  success: boolean;
  message: string;
  user: User;
}

export class UserLoginResponseDto {
  success: boolean;
  message: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}
