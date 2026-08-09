import { getHajjLevel, type HajjLevelId } from '../data/hajjLevels';

export function calculateProbability(applicants: number, availablePlaces: number): number {
  if (applicants <= 0 || availablePlaces < 0) throw new Error('Invalid lottery statistics');
  return Math.min(availablePlaces / applicants, 1);
}

export function getLevelProbability(levelId: HajjLevelId): number {
  const level = getHajjLevel(levelId);
  return calculateProbability(level.applicants, level.availablePlaces);
}

export function isWinningDraw(levelId: HajjLevelId, randomValue: number): boolean {
  if (randomValue < 0 || randomValue >= 1) throw new Error('Random value must be in [0, 1)');
  return randomValue < getLevelProbability(levelId);
}

export function secureRandom(): number {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] / 2 ** 32;
  }
  return Math.random();
}
