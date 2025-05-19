import { User, UserRole } from 'libs/database/schemas/user.schema';

export class UserRegisterResponseDto {
  success: boolean;
  message: string;
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

export class UserLoginResponseDto {
  success: boolean;
  message: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export class UpdateUserRoleResponseDto {
  success: boolean;
  message: string;
  role: UserRole;
}

export class GetUsersResponseDto {
  success: boolean;
  message: string;
  users: User[];
  total: number;
}
