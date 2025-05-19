import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventParticipation, EventParticipationDocument } from 'libs/database/schemas/event-participation.schema';
import { Event, EventCondition, EventDocument, Reward } from 'libs/database/schemas/event.schema';
import { Model, Types } from 'mongoose';
import { CreateEventRequestDto } from './dtos/event-request.dto';
import { EventConditionType, EventRewardType, EventStatus } from 'libs/database/enums/event.enum';
import { RpcException } from '@nestjs/microservices';
import { AppError } from 'libs/common/exception/error';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventParticipation.name) private eventParticipationModel: Model<EventParticipationDocument>,
  ) {}

  // 이벤트 생성
  async createEvent(createEventRequestDto: CreateEventRequestDto) {
    const createdConditions = await this.createEventConditions(createEventRequestDto.conditions);
    const createdRewards = await this.createEventRewards(createEventRequestDto.rewards || []);

    const event = new this.eventModel({
      name: createEventRequestDto.name,
      startDate: createEventRequestDto.startDate,
      endDate: createEventRequestDto.endDate,
      isActive: createEventRequestDto.isActive,
      conditions: createdConditions,
      rewards: createdRewards,
    });

    return event.save();
  }

  // 이벤트 조건 생성
  private createEventConditions(conditions: EventCondition[]): EventCondition[] {
    const createdEventConditions: EventCondition[] = [];

    for (const condition of conditions) {
      switch (condition.type) {
        case EventConditionType.LOGIN_COUNT:
          createdEventConditions.push({
            type: EventConditionType.LOGIN_COUNT,
            count: condition.count,
          });
          break;
        case EventConditionType.PURCHASE_AMOUNT:
          createdEventConditions.push({
            type: EventConditionType.PURCHASE_AMOUNT,
            amount: condition.amount,
          });
          break;
        case EventConditionType.REFERRAL_COUNT:
          createdEventConditions.push({
            type: EventConditionType.REFERRAL_COUNT,
            referralCount: condition.referralCount,
          });
          break;
      }
    }

    return createdEventConditions;
  }

  // 이벤트 보상(리워드) 생성
  private createEventRewards(rewards: Reward[]): Reward[] {
    const createdEventRewards: Reward[] = [];

    for (const reward of rewards) {
      switch (reward.type) {
        case EventRewardType.COUPON:
          createdEventRewards.push({
            _id: new Types.ObjectId(),
            type: EventRewardType.COUPON,
            couponId: new Types.ObjectId().toString(),
            quantity: reward.quantity,
          });
          break;
        case EventRewardType.POINT:
          createdEventRewards.push({
            _id: new Types.ObjectId(),
            type: EventRewardType.POINT,
            quantity: reward.quantity,
          });
          break;
        case EventRewardType.ITEM:
          createdEventRewards.push({
            _id: new Types.ObjectId(),
            type: EventRewardType.ITEM,
            itemId: new Types.ObjectId().toString(),
            quantity: reward.quantity,
          });
          break;
      }
    }
    return createdEventRewards;
  }

  // 이벤트 참여 확인
  async checkEventParticipation(eventId: string, userId: string): Promise<boolean> {
    try {
      const event = await this.eventModel.findById(eventId);
      if (!event) {
        throw new RpcException(AppError.EVENT.NOT_FOUND);
      }

      // 이미 참여한 이벤트인지 확인
      const existingParticipation = await this.eventParticipationModel.findOne({
        userId,
        eventId,
      });

      if (existingParticipation) {
        return existingParticipation.status === EventStatus.COMPLETED;
      }

      const isCondition = await this.checkEventCondition(event, userId);
      if (isCondition) {
        // 이벤트 참여 정보 생성 (완료 상태)
        const participation = new this.eventParticipationModel({
          userId,
          eventId,
          status: EventStatus.COMPLETED,
          completedAt: new Date(),
        });

        await participation.save();
        return true;
      }

      // 조건을 만족하지 못한 경우 (대기 상태)
      const participation = new this.eventParticipationModel({
        userId,
        eventId,
        status: EventStatus.PENDING,
      });

      await participation.save();
      return false;
    } catch (error) {
      console.error('이벤트 참여 확인 실패:', error);
      throw new RpcException(AppError.EVENT.CHECK_PARTICIPATION_FAILED);
    }
  }

  // 이벤트 조건 확인
  async checkEventCondition(event: EventDocument, userId: string): Promise<boolean> {
    const session = await this.eventModel.startSession();
    try {
      return await session.withTransaction(async () => {
        for (const condition of event.conditions) {
          const isConditionMet = await this.validateCondition(condition, userId, event._id?.toString() || '');
          if (!isConditionMet) {
            return false;
          }
        }
        return true;
      });
    } finally {
      await session.endSession();
    }
  }

  // 조건별 검증 로직
  private async validateCondition(condition: EventCondition, userId: string, eventId: string): Promise<boolean> {
    switch (condition.type) {
      case EventConditionType.LOGIN_COUNT:
        return await this.validateLoginCount(userId, condition.count);
      case EventConditionType.PURCHASE_AMOUNT:
        return await this.validatePurchaseAmount(userId, condition.amount);
      case EventConditionType.REFERRAL_COUNT:
        return await this.validateReferralCount(userId, condition.referralCount);
      default:
        throw new RpcException(AppError.EVENT.CONDITION.INVALID_TYPE);
    }
  }

  // 로그인 횟수 검증
  private async validateLoginCount(userId: string, requiredCount: number): Promise<boolean> {
    const loginCount = await this.eventParticipationModel.countDocuments({
      userId,
      status: EventStatus.COMPLETED,
      type: EventConditionType.LOGIN_COUNT,
    });
    return loginCount >= requiredCount;
  }

  // 구매 금액 검증
  private async validatePurchaseAmount(userId: string, requiredAmount: number): Promise<boolean> {
    const purchaseAmount = await this.eventParticipationModel.aggregate([
      {
        $match: {
          userId,
          status: EventStatus.COMPLETED,
          type: EventConditionType.PURCHASE_AMOUNT,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);
    return (purchaseAmount[0]?.totalAmount || 0) >= requiredAmount;
  }

  // 추천인 수 검증
  private async validateReferralCount(userId: string, requiredCount: number): Promise<boolean> {
    const referralCount = await this.eventParticipationModel.countDocuments({
      userId,
      status: EventStatus.COMPLETED,
      type: EventConditionType.REFERRAL_COUNT,
    });
    return referralCount >= requiredCount;
  }

  // 쿠폰 생성
  async createCoupon(couponId: string): Promise<Reward> {
    const existingCoupon = await this.eventModel.findById(couponId);
    if (!existingCoupon) {
      throw new RpcException(AppError.EVENT.COUPON.NOT_FOUND);
    }

    const coupon = existingCoupon.rewards.find((reward) => reward.type === EventRewardType.COUPON);
    if (!coupon) {
      throw new RpcException(AppError.EVENT.COUPON.NOT_FOUND);
    }

    return {
      _id: new Types.ObjectId(),
      type: EventRewardType.COUPON,
      couponId: new Types.ObjectId().toString(),
      quantity: coupon.quantity,
    };
  }

  // 포인트 생성
  async createPoint(quantity: number): Promise<Reward> {
    const existingQuantity = await this.eventModel.findById(quantity);
    if (!existingQuantity) {
      throw new RpcException(AppError.EVENT.POINT.NOT_FOUND);
    }

    return {
      _id: new Types.ObjectId(),
      type: EventRewardType.POINT,
      quantity: quantity,
    };
  }

  // 아이템 생성
  async createItem(itemId: string): Promise<Reward> {
    const existingItem = await this.eventModel.findById(itemId);
    if (!existingItem) {
      throw new RpcException(AppError.EVENT.ITEM.NOT_FOUND);
    }

    const item = existingItem.rewards.find((reward) => reward.type === EventRewardType.ITEM);
    if (!item) {
      throw new RpcException(AppError.EVENT.ITEM.NOT_FOUND);
    }

    return {
      _id: new Types.ObjectId(),
      type: EventRewardType.ITEM,
      itemId: new Types.ObjectId().toString(),
      quantity: item.quantity,
    };
  }

  // 이벤트 목록 조회
  async getEvents(isActive?: boolean) {
    try {
      const query = isActive !== undefined ? { isActive } : {};
      const events = await this.eventModel.find(query).exec();
      return events;
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
      throw new RpcException(AppError.EVENT.GET_EVENTS_FAILED);
    }
  }

  // 이벤트 상세 조회
  async getEventById(eventId: string) {
    try {
      const event = await this.eventModel.findById(eventId).exec();
      if (!event) {
        throw new RpcException(AppError.EVENT.NOT_FOUND);
      }
      return event;
    } catch (error) {
      console.error('이벤트 상세 조회 실패:', error);
      throw new RpcException(AppError.EVENT.GET_EVENT_FAILED);
    }
  }

  // 이벤트 상태 변경
  async updateEventStatus(eventId: string, isActive: boolean) {
    try {
      const event = await this.eventModel.findByIdAndUpdate(eventId, { isActive }, { new: true }).exec();

      if (!event) {
        throw new RpcException(AppError.EVENT.NOT_FOUND);
      }
      return event;
    } catch (error) {
      console.error('이벤트 상태 변경 실패:', error);
      throw new RpcException(AppError.EVENT.UPDATE_STATUS_FAILED);
    }
  }
}
