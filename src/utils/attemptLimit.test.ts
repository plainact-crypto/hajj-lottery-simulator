import { beforeEach, describe, expect, it, vi } from 'vitest';
import { claimAttempt, MAX_ATTEMPTS_PER_EMAIL } from './attemptLimit';

describe('attempt limit fallback', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  });

  it('allows exactly three local attempts per normalized email', async () => {
    for (let i = 1; i <= MAX_ATTEMPTS_PER_EMAIL; i += 1) {
      const result = await claimAttempt(' Test@Example.com ', false);
      expect(result.allowed).toBe(true);
      expect(result.used).toBe(i);
    }
    const denied = await claimAttempt('test@example.com', false);
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
  });
});
