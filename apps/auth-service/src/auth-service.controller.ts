import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { UserLoginRequestDto, UserRegisterRequestDto } from './dtos/auth-request.dto';
import { UserLoginResponseDto, UserRegisterResponseDto } from './dtos/auth-response.dto';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('register')
  async register(@Body() body: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    const user = await this.authServiceService.register(body);
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user,
    };
  }

  @Post('login')
  async login(@Body() body: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const { accessToken, user } = await this.authServiceService.login(body);
    return {
      success: true,
      message: '로그인이 완료되었습니다.',
      accessToken,
      user,
    };
  }
}
