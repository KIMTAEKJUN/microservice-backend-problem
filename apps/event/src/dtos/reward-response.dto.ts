import { Reward } from 'libs/database/schemas/event.schema';
import { EventStatus, EventConditionType } from 'libs/database/enums/event.enum';

export class RewardResponseDto {
  success: boolean;
  message: string;
  reward: Reward;
}

export class RewardsResponseDto {
  success: boolean;
  message: string;
  rewards: Reward[];
}

export class RequestRewardResponseDto {
  success: boolean;
  message: string;
  reward?: Reward;
  participation: {
    status: string;
    requestedAt: Date;
    completedAt?: Date;
  };
  event: {
    id: string;
    name: string;
    isActive: boolean;
  };
}

export class RewardRequestHistoryDto {
  userId: string;
  participation: {
    id: string;
    status: EventStatus;
    requestedAt: Date;
    completedAt?: Date;
  };
  event: {
    id: string;
    name: string;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    conditions: {
      type: EventConditionType;
      count?: number;
      amount?: number;
      referralCount?: number;
    }[];
  };
  rewards: Reward[];
}

export class GetRewardRequestsResponseDto {
  success: boolean;
  message: string;
  rewardRequests: RewardRequestHistoryDto[];
  total: number;
}
