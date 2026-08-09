const STORAGE_KEY = 'hajj-sim-stats-v2';

export interface AttemptStats {
  attempts: number;
  wins: number;
  losses: number;
  persistedRemotely: boolean;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function localRecord(email: string, won: boolean): AttemptStats {
  const normalized = normalizeEmail(email);
  let map: Record<string, Omit<AttemptStats, 'persistedRemotely'>> = {};

  try {
    map = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    map = {};
  }

  const current = map[normalized] || { attempts: 0, wins: 0, losses: 0 };
  const next = {
    attempts: current.attempts + 1,
    wins: current.wins + (won ? 1 : 0),
    losses: current.losses + (won ? 0 : 1),
  };

  map[normalized] = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  return { ...next, persistedRemotely: false };
}

export async function recordAttempt(
  email: string,
  marketingOptIn: boolean,
  won: boolean,
): Promise<AttemptStats> {
  try {
    const response = await fetch('/api/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizeEmail(email),
        marketingOptIn,
        won,
      }),
    });

    if (response.ok) {
      const data = await response.json() as Omit<AttemptStats, 'persistedRemotely'>;
      return { ...data, persistedRemotely: true };
    }
  } catch {
    // Static/local development falls back to browser storage.
  }

  return localRecord(email, won);
}
