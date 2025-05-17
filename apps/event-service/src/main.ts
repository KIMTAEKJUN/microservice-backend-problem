import { NestFactory } from '@nestjs/core';
import { EventServiceModule } from './event-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EventServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 5000,
    },
  });
  await app.listen();
}
bootstrap();
