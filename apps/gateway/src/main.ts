import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Gateway Microservice 서비스가 ${process.env.GATEWAY_SERVICE_HOST ?? 'localhost'}:${process.env.PORT ?? 3000}에서 실행 중입니다.`);
}
bootstrap().catch((error) => {
  console.error('Gateway Microservice 애플리케이션 시작 실패:', error);
});
