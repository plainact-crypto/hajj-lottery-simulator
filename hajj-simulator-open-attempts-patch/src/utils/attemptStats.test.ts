import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordAttempt } from './attemptStats';

describe('attempt statistics fallback', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  });

  it('keeps unlimited attempts and records wins and losses per normalized email', async () => {
    expect(await recordAttempt(' Test@Example.com ', false, true)).toMatchObject({ attempts: 1, wins: 1, losses: 0 });
    expect(await recordAttempt('test@example.com', false, false)).toMatchObject({ attempts: 2, wins: 1, losses: 1 });
    expect(await recordAttempt('test@example.com', false, true)).toMatchObject({ attempts: 3, wins: 2, losses: 1 });
    expect(await recordAttempt('test@example.com', false, false)).toMatchObject({ attempts: 4, wins: 2, losses: 2 });
  });
});
