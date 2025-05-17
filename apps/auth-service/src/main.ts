import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from 'libs/common/exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4000,
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  // const corsOptions: CorsOptions = {
  //   origin: ['http://localhost:5173', 'http://localhost:3000', 'http://15.164.171.53', 'http://13.124.164.107'],
  //   credentials: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   optionsSuccessStatus: 200,
  // };
  // app.(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: true,
    }),
  );

  await app.listen();
}
bootstrap().catch((error) => {
  console.error('애플리케이션 시작 실패:', error);
});
