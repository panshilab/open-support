import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(EnvService);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: env.corsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(new ZodValidationPipe());
  app.use('/uploads/media', express.static(env.media.localDir));
  app.enableShutdownHooks();

  await app.listen(env.port, env.host);
}

void bootstrap();
