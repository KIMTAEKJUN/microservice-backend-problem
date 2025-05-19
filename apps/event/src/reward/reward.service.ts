import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, Reward } from 'libs/database/schemas/event.schema';
import { Model, Types } from 'mongoose';
import { CreateRewardRequestDto, RequestRewardDto } from '../dtos/reward-request.dto';
import { EventRewardType, EventStatus } from 'libs/database/enums/event.enum';
import { RpcException } from '@nestjs/microservices';
import { AppError } from 'libs/common/exception/error';
import { EventParticipation } from 'libs/database/schemas/event-participation.schema';
import { RequestRewardResponseDto, RewardRequestHistoryDto } from '../dtos/reward-response.dto';
import { GetRewardRequestsResponseDto } from '../dtos/reward-response.dto';
import { GetUserRewardRequestsDto, GetAdminRewardRequestsDto } from '../dtos/reward-request.dto';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(EventParticipation.name) private participationModel: Model<EventParticipation>,
  ) {}

  // 보상 등록
  async createReward(eventId: string, dto: CreateRewardRequestDto) {
    try {
      const event = await this.eventModel.findById(eventId);
      if (!event) {
        throw new RpcException(AppError.EVENT.NOT_FOUND);
      }

      let reward: Reward;
      switch (dto.type) {
        case EventRewardType.POINT:
          reward = {
            _id: new Types.ObjectId(),
            type: EventRewardType.POINT,
            quantity: dto.quantity,
          };
          break;
        case EventRewardType.COUPON:
          reward = {
            _id: new Types.ObjectId(),
            type: EventRewardType.COUPON,
            couponId: new Types.ObjectId().toString(),
            quantity: dto.quantity,
          };
          break;
        case EventRewardType.ITEM:
          reward = {
            _id: new Types.ObjectId(),
            type: EventRewardType.ITEM,
            itemId: new Types.ObjectId().toString(),
            quantity: dto.quantity,
          };
          break;
        default:
          throw new RpcException(AppError.EVENT.REWARD.INVALID_TYPE);
      }

      event.rewards.push(reward);
      await event.save();

      return reward;
    } catch (error) {
      console.error('보상 등록 실패:', error);
      throw new RpcException(AppError.EVENT.REWARD.CREATE_FAILED);
    }
  }

  // 보상 목록 조회
  async getRewards(eventId: string) {
    try {
      const event = await this.eventModel.findById(eventId);
      if (!event) {
        throw new RpcException(AppError.EVENT.NOT_FOUND);
      }

      return event.rewards;
    } catch (error) {
      console.error('보상 목록 조회 실패:', error);
      throw new RpcException(AppError.EVENT.REWARD.GET_FAILED);
    }
  }

  // 보상 상세 조회
  async getRewardById(eventId: string, rewardId: string) {
    try {
      const event = await this.eventModel.findOne({
        'rewards._id': new Types.ObjectId(rewardId),
      });

      if (!event) {
        throw new RpcException(AppError.EVENT.NOT_FOUND);
      }

      const reward = event.rewards.find((r) => r._id?.toString() === rewardId);
      if (!reward) {
        throw new RpcException(AppError.EVENT.REWARD.NOT_FOUND);
      }

      return reward;
    } catch (error) {
      console.error('보상 상세 조회 실패:', error);
      throw new RpcException(AppError.EVENT.REWARD.GET_FAILED);
    }
  }

  // 보상 요청
  async requestReward(eventId: string, dto: RequestRewardDto): Promise<RequestRewardResponseDto> {
    // 1. 이벤트 존재 여부 확인
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new RpcException(AppError.EVENT.NOT_FOUND);
    }

    // 2. 이벤트 기간 확인
    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      throw new RpcException(AppError.EVENT.NOT_IN_PERIOD);
    }

    // 3. 이벤트 활성화 상태 확인
    if (!event.isActive) {
      throw new RpcException(AppError.EVENT.NOT_ACTIVE);
    }

    // 4. 조건 충족 여부 확인 -> 테스트를 위한 주석 처리
    // const isConditionMet = await this.eventService.checkEventCondition(event, dto.userId);
    // if (!isConditionMet) {
    //   throw new RpcException(AppError.EVENT.CONDITION.NOT_MET);
    // }

    // 5. 보상 존재 여부 확인
    if (!event.rewards || event.rewards.length === 0) {
      throw new RpcException(AppError.EVENT.REWARD.NOT_FOUND);
    }

    // 6. 이미 참여했는지 확인
    const existingParticipation = await this.participationModel.findOne({
      eventId: eventId,
      userId: dto.userId,
    });

    if (existingParticipation) {
      throw new RpcException(AppError.EVENT.ALREADY_PARTICIPATED);
    }

    // 7. 보상 요청 처리 (PENDING 상태로 시작)
    const participation = await this.participationModel.create({
      eventId: eventId,
      userId: dto.userId,
      status: EventStatus.PENDING,
      requestedAt: new Date(),
    });

    try {
      // 8. 보상 지급 처리
      await this.processReward(participation.id, event.rewards[0], dto.userId);

      // 9. 참여 상태 업데이트
      participation.status = EventStatus.COMPLETED;
      participation.completedAt = new Date();
      await participation.save();

      return {
        success: true,
        message: '보상 요청이 성공적으로 처리되었습니다.',
        reward: event.rewards[0],
        participation: {
          status: participation.status,
          requestedAt: participation.requestedAt,
          completedAt: participation.completedAt,
        },
        event: {
          id: event.id,
          name: event.name,
          isActive: event.isActive,
        },
      };
    } catch (error) {
      // 10. 보상 지급 실패 시 상태 업데이트
      participation.status = EventStatus.FAILED;
      await participation.save();
      throw new RpcException(AppError.EVENT.REWARD.PROCESS_FAILED);
    }
  }

  // 보상 지급 처리
  private async processReward(participationId: Types.ObjectId, reward: Reward, userId: string): Promise<void> {
    try {
      switch (reward.type) {
        case EventRewardType.POINT:
          // 포인트 지급 로직 (추후에 구현 필요)
          break;
        case EventRewardType.COUPON:
          // 쿠폰 지급 로직 (추후에 구현 필요)
          break;
        case EventRewardType.ITEM:
          // 아이템 지급 로직 (추후에 구현 필요)
          break;
        default:
          throw new RpcException(AppError.EVENT.REWARD.INVALID_TYPE);
      }
    } catch (error) {
      console.error('보상 지급 처리 실패:', error);
      throw new RpcException(AppError.EVENT.REWARD.PROCESS_FAILED);
    }
  }

  // 일반 사용자용 보상 요청 내역 조회
  async getUserRewardRequests(dto: GetUserRewardRequestsDto): Promise<GetRewardRequestsResponseDto> {
    try {
      const requests = await this.participationModel.find({ userId: dto.userId }).sort({ requestedAt: -1 }).exec();

      const eventIds = [...new Set(requests.map((req) => req.eventId))];

      const events = await this.eventModel
        .find({ _id: { $in: eventIds } })
        .lean()
        .exec();

      const requestHistories = requests
        .map((request) => {
          const event = events.find((e) => e._id.toString() === request.eventId.toString());
          if (!event) {
            throw new RpcException(AppError.EVENT.NOT_FOUND);
          }
          return {
            success: true,
            message: '일반 사용자 보상 요청 내역이 조회되었습니다.',
            userId: request.userId.toString(),
            participation: {
              id: request._id,
              status: request.status,
              requestedAt: request.requestedAt,
              completedAt: request.completedAt,
            },
            event: {
              id: event._id.toString(),
              name: event.name,
              isActive: event.isActive,
              startDate: event.startDate,
              endDate: event.endDate,
              conditions: event.conditions,
            },
            rewards: event.rewards,
          } as RewardRequestHistoryDto;
        })
        .filter((history): history is RewardRequestHistoryDto => history !== null);

      return {
        success: true,
        message: '일반 사용자 보상 요청 내역이 조회되었습니다.',
        rewardRequests: requestHistories,
        total: requestHistories.length,
      };
    } catch (error) {
      console.error('보상 요청 내역 조회 실패:', error);
      throw new RpcException(AppError.EVENT.REWARD.GET_REQUESTS_FAILED);
    }
  }

  // 관리자/운영자/감시자용 보상 요청 내역 조회
  async getAdminRewardRequests(dto: GetAdminRewardRequestsDto): Promise<GetRewardRequestsResponseDto> {
    try {
      const query: any = {};

      if (dto.eventId) query.eventId = dto.eventId;
      if (dto.userId) query.userId = dto.userId;
      if (dto.status) query.status = dto.status;

      // 날짜 필터링
      if (dto.startDate || dto.endDate) {
        query.requestedAt = {};
        if (dto.startDate) query.requestedAt.$gte = new Date(dto.startDate);
        if (dto.endDate) query.requestedAt.$lte = new Date(dto.endDate);
      }

      console.log('관리자 조회 쿼리:', query);

      const requests = await this.participationModel.find(query).sort({ requestedAt: -1 }).exec();

      console.log(
        '관리자 참여 내역 조회 결과:',
        requests.map((req) => ({
          participationId: req._id,
          eventId: req.eventId.toString(),
          status: req.status,
          requestedAt: req.requestedAt,
          completedAt: req.completedAt,
        })),
      );

      const eventIds = [...new Set(requests.map((req) => req.eventId))];
      console.log('관리자 이벤트 ID 목록:', eventIds);

      const events = await this.eventModel
        .find({ _id: { $in: eventIds } })
        .lean()
        .exec();

      console.log(
        '관리자 이벤트 조회 결과:',
        events.map((e) => ({
          eventId: e._id.toString(),
          name: e.name,
          isActive: e.isActive,
        })),
      );

      const requestHistories = requests
        .map((request) => {
          const event = events.find((e) => e._id.toString() === request.eventId.toString());
          if (!event) {
            throw new RpcException(AppError.EVENT.NOT_FOUND);
          }
          return {
            success: true,
            message: '관리자 보상 요청 내역이 조회되었습니다.',
            userId: request.userId.toString(),
            participation: {
              id: request._id,
              status: request.status,
              requestedAt: request.requestedAt,
              completedAt: request.completedAt,
            },
            event: {
              id: event._id.toString(),
              name: event.name,
              isActive: event.isActive,
              startDate: event.startDate,
              endDate: event.endDate,
              conditions: event.conditions,
            },
            rewards: event.rewards,
          } as RewardRequestHistoryDto;
        })
        .filter((history): history is RewardRequestHistoryDto => history !== null);

      console.log(
        '관리자 최종 결과:',
        requestHistories.map((history) => ({
          participationId: history.participation.id,
          eventId: history.event.id,
          status: history.participation.status,
          requestedAt: history.participation.requestedAt,
        })),
      );

      return {
        success: true,
        message: '관리자 보상 요청 내역이 조회되었습니다.',
        rewardRequests: requestHistories,
        total: requestHistories.length,
      };
    } catch (error) {
      console.error('보상 요청 내역 조회 실패:', error);
      throw new RpcException(AppError.EVENT.REWARD.GET_REQUESTS_FAILED);
    }
  }
}
