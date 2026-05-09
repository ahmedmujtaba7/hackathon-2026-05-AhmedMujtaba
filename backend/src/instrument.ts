/**
 * Sentry instrumentation — MUST be imported before any other module in main.ts.
 *
 * Sentry patches Node.js internals on init, so it needs to run before NestJS
 * (and before any service/module code) to capture all errors and traces.
 */

import * as Sentry from '@sentry/node';

const dsn = process.env.SENTRY_DSN;

Sentry.init({
  dsn,

  // Performance tracing — capture 100% of transactions in production for the
  // hackathon demo. Lower this to 0.1–0.2 for high-traffic apps.
  tracesSampleRate: 1.0,

  environment: process.env.NODE_ENV ?? 'development',
  release: process.env.npm_package_version ?? '0.1.0',

  // Only actually send events when a DSN is configured.
  // This prevents noise in local dev without a DSN set.
  enabled: !!dsn,

  // Integrations: HTTP + Express tracing (NestJS runs on Express under the hood)
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
  ],

  // Ignore expected user-facing errors so Sentry stays signal-only
  ignoreErrors: [
    'UnauthorizedException',
    'ForbiddenException',
    'NotFoundException',
    'BadRequestException',
    'InsufficientCoinsError',
    'HintAlreadyUsedError',
    'SessionNotFoundError',
    'SessionNotActiveError',
    'SessionExpiredError',
    'SuspectNotFoundError',
  ],
});
