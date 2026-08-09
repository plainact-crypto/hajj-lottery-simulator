export type HajjLevelId = 'economy-air' | 'land' | 'five-star' | 'five-star-kedana';

export interface HajjLevel {
  id: HajjLevelId;
  label: string;
  applicants: number;
  availablePlaces: number;
}

export const HAJJ_LEVELS: readonly HajjLevel[] = [
  { id: 'economy-air', label: 'اقتصادي - طيران', applicants: 87241, availablePlaces: 17060 },
  { id: 'land', label: 'بري', applicants: 15326, availablePlaces: 5700 },
  { id: 'five-star', label: 'خمس نجوم', applicants: 9173, availablePlaces: 5000 },
  { id: 'five-star-kedana', label: 'خمس نجوم - أبراج كدانة', applicants: 2864, availablePlaces: 2740 },
] as const;

export function getHajjLevel(id: HajjLevelId): HajjLevel {
  const level = HAJJ_LEVELS.find((item) => item.id === id);
  if (!level) throw new Error(`Unknown Hajj level: ${id}`);
  return level;
}
