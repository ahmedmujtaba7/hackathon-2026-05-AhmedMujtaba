/**
 * PostHog analytics — singleton client + typed event catalogue.
 *
 * All events go through `phCapture()` so we have one place to:
 *  - guard against SSR calls (PostHog is browser-only)
 *  - add global properties once (app_version, environment)
 *  - swap the implementation later without touching every call-site
 *
 * Usage:
 *   import { phCapture, phIdentify, phReset } from '@/lib/posthog';
 *   phCapture('case_started', { difficulty: 'hard', cost: 200 });
 */

import posthog from 'posthog-js';

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

let initialised = false;

/** Call once from the PostHog provider component (client side only). */
export function initPostHog() {
  if (initialised || typeof window === 'undefined' || !KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false,   // we fire page_viewed manually so we can attach route props
    capture_pageleave: true,
    autocapture: false,        // keep data clean — use explicit events only
    persistence: 'localStorage+cookie',
    loaded(ph) {
      if (process.env.NODE_ENV === 'development') {
        ph.opt_out_capturing();  // don't pollute prod data during local dev
      }
    },
  });
  initialised = true;
}

/** Identify a logged-in user. Call after successful auth. */
export function phIdentify(userId: string, traits: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  posthog.identify(userId, traits);
}

/** Reset identity on logout. */
export function phReset() {
  if (typeof window === 'undefined') return;
  posthog.reset();
}

/** Capture a page view — call in a useEffect after navigation. */
export function phPageView(url: string) {
  if (typeof window === 'undefined') return;
  posthog.capture('$pageview', { $current_url: url });
}

// ── Event catalogue ───────────────────────────────────────────────────────────

export type PhEvent =
  // Auth
  | 'sign_in_clicked'
  | 'auth_success'
  | 'auth_failure'
  | 'user_logout'

  // Game lifecycle
  | 'case_started'
  | 'case_start_failed'
  | 'investigation_begun'        // user clicked "Begin Investigation" in case file book
  | 'case_file_opened'
  | 'case_file_closed'

  // Interrogation
  | 'suspect_selected'
  | 'question_sent'
  | 'answer_received'

  // Hints & accusation
  | 'hint_requested'
  | 'hint_received'
  | 'accusation_panel_opened'
  | 'accusation_cancelled'

  // Verdict
  | 'verdict_submitted'
  | 'verdict_result'
  | 'timer_expired'

  // Post-game
  | 'play_again_clicked'
  | 'return_to_dashboard_clicked';

/**
 * Fire a typed PostHog event.
 * Safe to call during SSR — guards internally.
 */
export function phCapture(event: PhEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  posthog.capture(event, properties);
}
