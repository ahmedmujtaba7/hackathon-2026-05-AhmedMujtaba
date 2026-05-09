import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { CaseModule } from './case/case.module';
import { InterrogateModule } from './interrogate/interrogate.module';
import { HintModule } from './hint/hint.module';
import { VerdictModule } from './verdict/verdict.module';
import { CoinModule } from './coin/coin.module';
import { AiModule } from './ai/ai.module';
import { AppLoggerService } from './common/logger/app-logger.service';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AiModule,
    CoinModule,
    AuthModule,
    CaseModule,
    InterrogateModule,
    HintModule,
    VerdictModule,
  ],
  providers: [
    AppLoggerService,
    // Global Sentry exception filter — captures 5xx errors, skips 4xx user errors
    {
      provide: APP_FILTER,
      useClass: SentryExceptionFilter,
    },
  ],
  exports: [AppLoggerService],
})
export class AppModule {}
