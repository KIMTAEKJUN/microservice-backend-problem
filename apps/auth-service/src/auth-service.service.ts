import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'libs/database/schemas/user.schema';
import { Model } from 'mongoose';
import { UserLoginRequestDto, UserRegisterRequestDto } from './dtos/auth-request.dto';
import { AppError } from 'libs/common/exception/error';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'libs/database/enums/user.enum';
@Injectable()
export class AuthServiceService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(req: UserRegisterRequestDto): Promise<User> {
    const { name, password } = req;

    // 이미 존재하는 유저인지 확인
    const existingUser = await this.userModel.findOne({ name }).exec();
    if (existingUser) {
      throw new BadRequestException(AppError.USER.NAME_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ name, password: hashedPassword, role: UserRole.USER });
    return newUser.save();
  }

  async login(req: UserLoginRequestDto) {
    const { name, password } = req;
    const user = await this.validateUser(name, password);

    if (!user) {
      throw new BadRequestException(AppError.AUTH.INVALID_CREDENTIALS);
    }

    const payload = { id: user._id, name: user.name, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ name }).exec();
    if (!user) {
      throw new BadRequestException(AppError.USER.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const { password, ...result } = user.toObject();
      return result;
    }

    return;
  }
}
