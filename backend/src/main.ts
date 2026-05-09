// ⚠️  instrument.ts MUST be the first import — Sentry needs to patch Node.js
// internals before any application code loads.
import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';
import type { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Register Sentry global exception filter (captures 5xx, skips 4xx)
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new SentryExceptionFilter(app.get(HttpAdapterHost)),
  );

  // Sentry Express error handler — must be registered AFTER routes/middleware
  // so it can capture errors that propagate through the Express layer.
  Sentry.setupExpressErrorHandler(app.getHttpAdapter().getInstance());

  // Health-check endpoint for Railway / uptime monitors
  httpAdapter.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}
bootstrap();
