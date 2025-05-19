import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'libs/database/schemas/user.schema';
import { Model } from 'mongoose';
import { GetUsersRequestDto, UpdateUserRoleRequestDto, UserLoginRequestDto, UserRegisterRequestDto } from './dtos/auth-request.dto';
import { AppError } from 'libs/common/exception/error';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'libs/database/enums/user.enum';
import { RpcException } from '@nestjs/microservices';
import { GetUsersResponseDto } from './dtos/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // 회원 가입
  async register(req: UserRegisterRequestDto): Promise<User> {
    const { name, email, password } = req;

    // 이미 존재하는 이름인지 확인
    const existingUser = await this.userModel.findOne({ name }).exec();
    if (existingUser) {
      throw new RpcException(AppError.USER.NAME_ALREADY_EXISTS);
    }

    // 이미 존재하는 이메일인지 확인
    const existingEmail = await this.userModel.findOne({ email }).exec();
    if (existingEmail) {
      throw new RpcException(AppError.USER.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ name, email, password: hashedPassword, role: UserRole.USER });
    return newUser.save();
  }

  // 로그인
  async login(req: UserLoginRequestDto) {
    const { email, password } = req;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new RpcException(AppError.AUTH.INVALID_CREDENTIALS);
    }

    const payload = { id: user._id, name: user.name, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 관리자 유저 목록 조회
  async getUsers(dto: GetUsersRequestDto): Promise<GetUsersResponseDto> {
    try {
      const query: any = {};

      if (dto.name) {
        query.name = { $regex: dto.name, $options: 'i' };
      }
      if (dto.email) {
        query.email = { $regex: dto.email, $options: 'i' };
      }
      if (dto.role) {
        query.role = dto.role;
      }

      const users = await this.userModel.find(query).select('-password').sort({ createdAt: -1 }).exec();

      return {
        success: true,
        message: '유저 목록이 조회되었습니다.',
        users,
        total: users.length,
      };
    } catch (error) {
      console.error('유저 목록 조회 실패:', error);
      throw new RpcException(AppError.USER.GET_USERS_FAILED);
    }
  }

  // 관리자 유저 권한 변경
  async updateUserRole(userId: string, req: UpdateUserRoleRequestDto): Promise<User> {
    const { role } = req;
    const user = await this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).exec();
    if (!user) {
      throw new RpcException(AppError.USER.NOT_FOUND);
    }

    return user;
  }

  // 유저 검증
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new RpcException(AppError.USER.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const { password, ...result } = user.toObject();
      return result;
    }

    return null;
  }
}
