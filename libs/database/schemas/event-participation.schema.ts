import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { EventStatus } from '../enums/event.enum';

export type EventParticipationDocument = EventParticipation & Document;

const options: SchemaOptions = {
  timestamps: true,
  id: false,
};

@Schema(options)
export class EventParticipation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true, type: String, enum: EventStatus, default: EventStatus.PENDING })
  status: EventStatus;

  @Prop({ required: true, type: Date, default: Date.now })
  requestedAt: Date;

  @Prop({
    type: Date,
    required: function () {
      return this.status === EventStatus.COMPLETED;
    },
  })
  completedAt: Date;
}

export const EventParticipationSchema = SchemaFactory.createForClass(EventParticipation);

EventParticipationSchema.index({ userId: 1, eventId: 1 }, { unique: true });
