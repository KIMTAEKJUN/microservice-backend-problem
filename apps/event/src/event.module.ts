import { forwardRef, Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'libs/database/schemas/event.schema';
import { EventParticipation, EventParticipationSchema } from 'libs/database/schemas/event-participation.schema';
import { RewardModule } from './reward/reward.module';

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
    forwardRef(() => RewardModule),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
