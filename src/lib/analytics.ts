"use client";

type AnalyticsProps = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
  }
}

export const trackEvent = (event: string, props: AnalyticsProps = {}): void => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = { event, ...props };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }

  if (typeof window.plausible === "function") {
    window.plausible(event, { props });
  }

  window.dispatchEvent(
    new CustomEvent("dq:analytics", {
      detail: {
        event,
        props,
        ts: Date.now(),
      },
    }),
  );
};
