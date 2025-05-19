import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GetUsersRequestDto, UpdateUserRoleRequestDto, UserLoginRequestDto, UserRegisterRequestDto } from 'apps/auth/src/dtos/auth-request.dto';
import { CreateEventRequestDto, EventIdParamDto, GetEventsRequestDto, UpdateEventStatusRequestDto } from 'apps/event/src/dtos/event-request.dto';
import {
  CreateRewardRequestDto,
  GetAdminRewardRequestsDto,
  GetUserRewardRequestsDto,
  RequestRewardDto,
} from 'apps/event/src/dtos/reward-request.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from 'libs/decorators/roles.decorator';
import { UserRole } from 'libs/database/enums/user.enum';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // 회원 가입
  @Post('auth/register')
  async register(@Body() body: UserRegisterRequestDto) {
    return this.gatewayService.register(body);
  }

  // 로그인
  @Post('auth/login')
  async login(@Body() body: UserLoginRequestDto) {
    return this.gatewayService.login(body);
  }

  // 관리자 유저 목록 조회
  @Get('admin/get-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUsers(@Body() body: GetUsersRequestDto) {
    return this.gatewayService.getUsers(body);
  }

  // 관리자 유저 권한 변경
  @Put('admin/:userId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserRole(@Param('userId') userId: string, @Body() body: UpdateUserRoleRequestDto) {
    return this.gatewayService.updateUserRole(userId, body);
  }

  // 이벤트 생성
  @Post('event/create-event')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async createEvent(@Body() body: CreateEventRequestDto) {
    return this.gatewayService.createEvent(body);
  }

  // 이벤트 목록 조회
  @Get('event/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR, UserRole.USER)
  async getEvents(@Body() body: GetEventsRequestDto) {
    return this.gatewayService.getEvents(body);
  }

  // 이벤트 상세 조회
  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR, UserRole.USER)
  async getEventById(@Param() param: EventIdParamDto) {
    return this.gatewayService.getEventById(param);
  }

  // 이벤트 상태 변경
  @Put('event/:eventId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateEventStatus(@Param() param: EventIdParamDto, @Body() body: UpdateEventStatusRequestDto) {
    return this.gatewayService.updateEventStatus(param, body);
  }

  // 보상 등록
  @Post('event/:eventId/reward')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async createReward(@Param('eventId') eventId: string, @Body() body: CreateRewardRequestDto) {
    return this.gatewayService.createReward(eventId, body);
  }

  // 보상 목록 조회
  @Get('event/:eventId/rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR, UserRole.USER)
  async getRewards(@Param('eventId') eventId: string) {
    return this.gatewayService.getRewards(eventId);
  }

  // 보상 상세 조회
  @Get('event/:eventId/reward/:rewardId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR, UserRole.USER)
  async getRewardById(@Param('eventId') eventId: string, @Param('rewardId') rewardId: string) {
    return this.gatewayService.getRewardById(eventId, rewardId);
  }

  // 보상 요청
  @Post('event/:eventId/participate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async requestReward(@Param('eventId') eventId: string, @Body() body: RequestRewardDto) {
    return this.gatewayService.requestReward(eventId, body);
  }

  // 일반 사용자용 보상 요청 내역 조회
  @Get('user/event/reward/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async getUserRewardRequests(@Body() body: GetUserRewardRequestsDto) {
    return this.gatewayService.getUserRewardRequests(body);
  }

  // 관리자/운영자/감시자용 보상 요청 내역 조회
  @Get('admin/event/reward/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  async getAdminRewardRequests(@Body() body: GetAdminRewardRequestsDto) {
    return this.gatewayService.getAdminRewardRequests(body);
  }
}
