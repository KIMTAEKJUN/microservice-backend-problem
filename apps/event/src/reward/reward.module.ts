import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'libs/database/schemas/event.schema';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { EventParticipation, EventParticipationSchema } from 'libs/database/schemas/event-participation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventModule } from '../event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventParticipation.name, schema: EventParticipationSchema },
    ]),
    forwardRef(() => EventModule),
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
