import { describe, expect, it } from 'vitest';
import { resetAttempt } from './attempt';

describe('new attempt reset', () => {
  it('returns to the form and clears the stored result', () => {
    expect(resetAttempt()).toEqual({ stage: 'form', won: null });
    expect(resetAttempt()).not.toBe(resetAttempt());
  });
});
