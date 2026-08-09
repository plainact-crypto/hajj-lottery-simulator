import { describe, expect, it } from 'vitest';
import { getHajjLevel } from '../data/hajjLevels';
import { calculateProbability, getLevelProbability, isWinningDraw } from './lottery';

describe('lottery calculations', () => {
  it('calculates available places divided by applicants', () => {
    expect(calculateProbability(87241, 17060)).toBeCloseTo(17060 / 87241, 12);
  });
  it('maps every selected level to its own statistics', () => {
    expect(getHajjLevel('land').label).toBe('بري');
    expect(getLevelProbability('five-star-kedana')).toBeCloseTo(2740 / 2864, 12);
  });
  it('makes deterministic winner and non-winner decisions', () => {
    const probability = getLevelProbability('economy-air');
    expect(isWinningDraw('economy-air', probability - 0.000001)).toBe(true);
    expect(isWinningDraw('economy-air', probability)).toBe(false);
  });
});
