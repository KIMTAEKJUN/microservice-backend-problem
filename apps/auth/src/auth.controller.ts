import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUsersRequestDto, UpdateUserRoleRequestDto, UserLoginRequestDto, UserRegisterRequestDto } from './dtos/auth-request.dto';
import { GetUsersResponseDto, UpdateUserRoleResponseDto, UserLoginResponseDto, UserRegisterResponseDto } from './dtos/auth-response.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원 가입
  @MessagePattern('register')
  async register(@Payload() payload: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    const user = await this.authService.register(payload);
    return {
      success: true,
      message: '유저 회원가입이 완료되었습니다.',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 로그인
  @MessagePattern('login')
  async login(@Payload() payload: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const { accessToken, user } = await this.authService.login(payload);
    return {
      success: true,
      message: '유저 로그인이 완료되었습니다.',
      accessToken,
      user,
    };
  }

  // 관리자 유저 목록 조회
  @MessagePattern('admin-get-users')
  async getUsers(@Payload() payload: GetUsersRequestDto): Promise<GetUsersResponseDto> {
    return this.authService.getUsers(payload);
  }

  // 관리자 유저 권한 변경
  @MessagePattern('admin-update-user-role')
  async updateUserRole(@Payload() payload: { userId: string; dto: UpdateUserRoleRequestDto }): Promise<UpdateUserRoleResponseDto> {
    const user = await this.authService.updateUserRole(payload.userId, payload.dto);
    return {
      success: true,
      message: '유저 권한 변경이 완료되었습니다.',
      role: user.role,
    };
  }
}
