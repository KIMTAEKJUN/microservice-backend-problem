import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';
import { UserRole } from '../enums/user.enum';

export type UserDocument = User & Document;

const options: SchemaOptions = {
  timestamps: true,
  id: false,
};

@Schema(options)
export class User extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
