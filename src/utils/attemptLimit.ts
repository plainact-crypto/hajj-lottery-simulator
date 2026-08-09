export const MAX_ATTEMPTS_PER_EMAIL = 3;
const STORAGE_KEY = 'hajj-sim-attempts-v1';

export interface AttemptClaimResult {
  allowed: boolean;
  used: number;
  remaining: number;
  persistedRemotely: boolean;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function localClaim(email: string): AttemptClaimResult {
  const normalized = normalizeEmail(email);
  let map: Record<string, number> = {};
  try {
    map = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    map = {};
  }
  const used = Number(map[normalized] || 0);
  if (used >= MAX_ATTEMPTS_PER_EMAIL) {
    return { allowed: false, used, remaining: 0, persistedRemotely: false };
  }
  const next = used + 1;
  map[normalized] = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  return { allowed: true, used: next, remaining: MAX_ATTEMPTS_PER_EMAIL - next, persistedRemotely: false };
}

export async function claimAttempt(email: string, marketingOptIn: boolean): Promise<AttemptClaimResult> {
  try {
    const response = await fetch('/api/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizeEmail(email), marketingOptIn }),
    });
    if (response.ok || response.status === 429) {
      const data = await response.json() as AttemptClaimResult;
      return { ...data, persistedRemotely: true };
    }
  } catch {
    // Local development/static hosts fall back to browser-only enforcement.
  }
  return localClaim(email);
}
