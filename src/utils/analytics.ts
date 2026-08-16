export type FunnelEventName =
  | 'simulator_started'
  | 'attempt_persisted'
  | 'attempt_local_fallback'
  | 'result_viewed'
  | 'retry_clicked';

const SESSION_KEY = 'hajj-sim-session-v1';

function getSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export function trackFunnelEvent(
  eventName: FunnelEventName,
  data: {
    levelId?: string;
    marketingOptIn?: boolean;
    persistedRemotely?: boolean;
  } = {},
) {
  const payload = JSON.stringify({
    eventName,
    sessionId: getSessionId(),
    pagePath: window.location.pathname,
    ...data,
  });

  // Measurement must never block the simulator or expose the user's email/name.
  fetch('/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
