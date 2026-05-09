import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import type { Request } from 'express';

/**
 * Global exception filter — runs for every unhandled exception in NestJS.
 *
 * Strategy:
 *  - 4xx (HttpException with status < 500) → user / validation errors.
 *    These are expected and intentional — skip Sentry, just return the HTTP response.
 *  - 5xx (unknown or HttpException with status >= 500) → server bug / AI failure.
 *    Capture in Sentry with full request + user context, then return the HTTP response.
 */
@Catch()
@Injectable()
export class SentryExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request & { user?: { id: string; email: string } }>();

    // Determine HTTP status
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // Only send true server errors to Sentry (not 4xx user errors)
    if (status >= 500) {
      Sentry.withScope((scope) => {
        // Attach authenticated user if available
        if (req.user) {
          scope.setUser({ id: req.user.id, email: req.user.email });
        }

        // Attach request context
        scope.setContext('request', {
          method: req.method,
          url: req.url,
          headers: {
            'user-agent': req.headers['user-agent'],
            origin: req.headers['origin'],
          },
          body: req.body,
        });

        scope.setTag('http.status', status);
        scope.setTag('route', req.url);

        Sentry.captureException(exception);
      });
    }

    // Build and send the HTTP response — mirrors NestJS default behaviour
    let responseBody: Record<string, unknown>;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      responseBody =
        typeof res === 'string' ? { statusCode: status, message: res } : (res as Record<string, unknown>);
    } else {
      // Unknown non-HTTP error — hide internals from the client
      responseBody = {
        statusCode: 500,
        message: 'Internal server error',
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
