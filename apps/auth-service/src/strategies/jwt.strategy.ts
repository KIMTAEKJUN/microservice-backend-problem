import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AppError } from 'libs/common/exception/error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), (req) => req?.cookies?.accessToken]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret', 'secret-key'),
    });
  }

  async validate(payload: any) {
    try {
      if (!payload.id) {
        console.error({
          message: 'JWT 검증 실패',
          payload,
        });
        throw new UnauthorizedException(AppError.AUTH.INVALID_TOKEN);
      }

      console.log({
        message: 'JWT 검증 성공',
        payload,
      });

      return {
        id: payload.id,
        name: payload.name,
        role: payload.role,
      };
    } catch (error) {
      console.error(`JWT 검증 오류: ${error instanceof Error ? error.stack : String(error)}`, error instanceof Error ? error.stack : undefined);
      throw new UnauthorizedException(AppError.AUTH.INVALID_TOKEN);
    }
  }
}
