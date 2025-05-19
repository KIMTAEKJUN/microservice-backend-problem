import { NestFactory } from '@nestjs/core';
import { EventModule } from './event.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from 'libs/common/exception/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EventModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.EVENT_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.EVENT_SERVICE_PORT || '3002', 10),
    },
  });

  app.useGlobalFilters(new RpcExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  await app.listen();
  console.log(
    `Event Microservice 서비스가 ${process.env.EVENT_SERVICE_HOST || 'localhost'}:${process.env.EVENT_SERVICE_PORT || '3002'}에서 실행 중입니다.`,
  );
}
bootstrap().catch((error) => {
  console.error('Event Microservice 애플리케이션 시작 실패:', error);
});
