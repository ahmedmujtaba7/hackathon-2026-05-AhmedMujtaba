'use client';

/**
 * PostHog provider for Next.js App Router.
 *
 * Responsibilities:
 *  1. Initialise PostHog once on first client render.
 *  2. Fire a `page_viewed` event on every route change.
 *
 * This must be a Client Component ("use client") because PostHog is browser-only.
 * Wrap it around the app in `layout.tsx`.
 */

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, phPageView } from '@/lib/posthog';

function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Init once on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track every navigation
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      phPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PostHogPageTracker />
      {children}
    </>
  );
}
