import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { EventConditionType, EventRewardType } from '../enums/event.enum';

export type EventDocument = Event & Document;

const options: SchemaOptions = {
  timestamps: true,
  id: false,
};

// 조건 타입
export type EventCondition = LoginCountComponent | PurchaseAmountComponent | ReferralCountComponent;

class LoginCountComponent {
  type: EventConditionType.LOGIN_COUNT;
  @Prop({ required: true })
  count: number;
}

class PurchaseAmountComponent {
  type: EventConditionType.PURCHASE_AMOUNT;
  @Prop({ required: true })
  amount: number;
}

class ReferralCountComponent {
  type: EventConditionType.REFERRAL_COUNT;
  @Prop({ required: true })
  referralCount: number;
}

export type Reward = CouponReward | PointReward | ItemReward;

// 보상 타입
export class PointReward {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, enum: EventRewardType, type: String })
  type: EventRewardType.POINT;

  @Prop({ required: true, type: Number })
  quantity: number;
}

export class CouponReward {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, enum: EventRewardType, type: String })
  type: EventRewardType.COUPON;

  @Prop({ required: true, type: String })
  couponId: string;

  @Prop({ required: true, type: Number })
  quantity: number;
}

export class ItemReward {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, enum: EventRewardType, type: String })
  type: EventRewardType.ITEM;

  @Prop({ required: true, type: String })
  itemId: string;

  @Prop({ required: true, type: Number })
  quantity: number;
}

@Schema(options)
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ required: true, type: [Object] })
  conditions: EventCondition[];

  @Prop({ required: true, type: [Object] })
  rewards: Reward[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
