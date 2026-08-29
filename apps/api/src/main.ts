import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';
import { HttpExceptionFilter } from './observability/http-exception.filter';
import { ProductionLogger } from './observability/production.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  const env = app.get(EnvService);
  app.useLogger(app.get(ProductionLogger));

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: env.corsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.use('/uploads/media', express.static(env.media.localDir));
  app.enableShutdownHooks();

  await app.listen(env.port, env.host);
}

void bootstrap();
