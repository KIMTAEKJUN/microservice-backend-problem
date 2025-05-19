import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'apps/auth/src/auth.service';
import { AppError } from 'libs/common/exception/error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header) {
      throw new UnauthorizedException(AppError.AUTH.INVALID_HEADER);
    }

    if (!header.startsWith('Bearer ')) {
      throw new UnauthorizedException(AppError.AUTH.INVALID_HEADER);
    }

    const token = header.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(AppError.AUTH.NO_TOKEN);
    }

    try {
      const baseCanActivate = await super.canActivate(context);
      if (!baseCanActivate) {
        throw new UnauthorizedException(AppError.AUTH.INVALID_TOKEN);
      }
      return true;
    } catch (error) {
      console.error('JWT 인증 실패:', error);
      throw new UnauthorizedException(AppError.AUTH.INVALID_TOKEN);
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('JWT 인증 실패:', err || info);
      throw new UnauthorizedException(AppError.AUTH.INVALID_TOKEN);
    }
    return user;
  }
}
