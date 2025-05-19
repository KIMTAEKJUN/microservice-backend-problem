import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetUsersRequestDto, UpdateUserRoleRequestDto, UserLoginRequestDto, UserRegisterRequestDto } from 'apps/auth/src/dtos/auth-request.dto';
import { CreateEventRequestDto, EventIdParamDto, GetEventsRequestDto, UpdateEventStatusRequestDto } from 'apps/event/src/dtos/event-request.dto';
import {
  CreateRewardRequestDto,
  GetAdminRewardRequestsDto,
  GetUserRewardRequestsDto,
  RequestRewardDto,
} from 'apps/event/src/dtos/reward-request.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
  ) {}

  // 회원가입
  async register(dto: UserRegisterRequestDto) {
    return firstValueFrom(this.authClient.send('register', dto));
  }

  // 로그인
  async login(dto: UserLoginRequestDto) {
    return firstValueFrom(this.authClient.send('login', dto));
  }

  // 유저 목록 조회
  async getUsers(dto: GetUsersRequestDto) {
    return firstValueFrom(this.authClient.send('admin-get-users', dto));
  }

  // 유저 권한 변경
  async updateUserRole(userId: string, dto: UpdateUserRoleRequestDto) {
    return firstValueFrom(this.authClient.send('admin-update-user-role', { userId, dto }));
  }

  // 이벤트 생성
  async createEvent(dto: CreateEventRequestDto) {
    return firstValueFrom(this.eventClient.send('admin-create-event', dto));
  }

  // 이벤트 목록 조회
  async getEvents(dto: GetEventsRequestDto) {
    return firstValueFrom(this.eventClient.send('get-events', dto));
  }

  // 이벤트 상세 조회
  async getEventById(param: EventIdParamDto) {
    return firstValueFrom(this.eventClient.send('get-event', param));
  }

  // 이벤트 상태 변경
  async updateEventStatus(param: EventIdParamDto, dto: UpdateEventStatusRequestDto) {
    return firstValueFrom(this.eventClient.send('admin-update-event-status', { param, dto }));
  }

  // 보상 등록
  async createReward(eventId: string, dto: CreateRewardRequestDto) {
    return firstValueFrom(this.eventClient.send('create-reward', { eventId, dto }));
  }

  // 보상 목록 조회
  async getRewards(eventId: string) {
    return firstValueFrom(this.eventClient.send('get-rewards', { eventId }));
  }

  // 보상 상세 조회
  async getRewardById(eventId: string, rewardId: string) {
    return firstValueFrom(this.eventClient.send('get-reward', { eventId, rewardId }));
  }

  // 보상 요청
  async requestReward(eventId: string, dto: RequestRewardDto) {
    return firstValueFrom(this.eventClient.send('request-reward', { eventId, dto }));
  }

  // 일반 사용자용 보상 요청 내역 조회
  async getUserRewardRequests(dto: GetUserRewardRequestsDto) {
    return firstValueFrom(this.eventClient.send('user-get-reward-requests', dto));
  }

  // 관리자/운영자/감시자용 보상 요청 내역 조회
  async getAdminRewardRequests(dto: GetAdminRewardRequestsDto) {
    return firstValueFrom(this.eventClient.send('admin-get-reward-requests', dto));
  }
}
