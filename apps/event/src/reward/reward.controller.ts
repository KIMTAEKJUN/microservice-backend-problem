import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardService } from './reward.service';
import { CreateRewardRequestDto, RequestRewardDto, GetUserRewardRequestsDto, GetAdminRewardRequestsDto } from '../dtos/reward-request.dto';
import { RequestRewardResponseDto, RewardResponseDto, RewardsResponseDto } from '../dtos/reward-response.dto';
import { GetRewardRequestsResponseDto } from '../dtos/reward-response.dto';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  // 보상 등록
  @MessagePattern('create-reward')
  async createReward(@Payload() payload: { eventId: string; dto: CreateRewardRequestDto }): Promise<RewardResponseDto> {
    const reward = await this.rewardService.createReward(payload.eventId, payload.dto);
    return {
      success: true,
      message: '이벤트에 대한 보상 등록이 완료되었습니다.',
      reward,
    };
  }

  // 보상 목록 조회
  @MessagePattern('get-rewards')
  async getRewards(@Payload() payload: { eventId: string }): Promise<RewardsResponseDto> {
    const rewards = await this.rewardService.getRewards(payload.eventId);
    return {
      success: true,
      message: '이벤트에 대한 보상 목록이 조회되었습니다.',
      rewards,
    };
  }

  // 보상 상세 조회
  @MessagePattern('get-reward')
  async getRewardById(@Payload() payload: { eventId: string; rewardId: string }): Promise<RewardResponseDto> {
    const reward = await this.rewardService.getRewardById(payload.eventId, payload.rewardId);
    return {
      success: true,
      message: '이벤트에 대한 보상 상세 내역이 조회되었습니다.',
      reward,
    };
  }

  // 보상 요청
  @MessagePattern('request-reward')
  async requestReward(@Payload() payload: { eventId: string; dto: RequestRewardDto }): Promise<RequestRewardResponseDto> {
    const reward = await this.rewardService.requestReward(payload.eventId, payload.dto);
    return {
      success: true,
      message: '이벤트에 대한 보상 요청이 완료되었습니다.',
      reward: reward?.reward,
      participation: reward?.participation,
      event: reward?.event,
    };
  }

  // 일반 사용자용 보상 요청 내역 조회
  @MessagePattern('user-get-reward-requests')
  async getUserRewardRequests(@Payload() dto: GetUserRewardRequestsDto): Promise<GetRewardRequestsResponseDto> {
    return this.rewardService.getUserRewardRequests(dto);
  }

  // 관리자/운영자/감시자용 보상 요청 내역 조회
  @MessagePattern('admin-get-reward-requests')
  async getAdminRewardRequests(@Payload() dto: GetAdminRewardRequestsDto): Promise<GetRewardRequestsResponseDto> {
    return this.rewardService.getAdminRewardRequests(dto);
  }
}
