export type HajjLevelId = 'economy-air' | 'land' | 'five-star' | 'five-star-kedana';

export const HAJJ_DATASET = {
  seasonHijri: '1447هـ',
  seasonGregorian: '2026م',
  market: 'الحج السياحي المصري',
  sourceName: 'وزارة السياحة والآثار المصرية — نتيجة القرعة الإلكترونية العلنية للحج السياحي لموسم 1447هـ',
  sourceUrl: 'https://mota.gov.eg/ar/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-2-1-1/%D9%81%D9%8A-%D8%B6%D9%88%D8%A1-%D8%A7%D9%84%D8%B6%D9%88%D8%A7%D8%A8%D8%B7-%D9%88%D8%A7%D9%84%D9%82%D9%88%D8%A7%D8%B9%D8%AF-%D8%A7%D9%84%D9%85%D9%86%D8%B8%D9%85%D8%A9-%D9%84%D9%84%D8%AD%D8%AC-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%AA%D9%85%D8%AF%D8%A9-%D9%85%D9%86-%D9%88%D8%B2%D9%8A%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9-%D9%88%D8%A7%D9%84%D8%A2%D8%AB%D8%A7%D8%B1-%D9%88%D8%B2%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9-%D9%88%D8%A7%D9%84%D8%A2%D8%AB%D8%A7%D8%B1-%D8%AA%D8%B9%D9%84%D9%86-%D8%B9%D9%86-%D9%86%D8%AA%D9%8A%D8%AC%D8%A9-%D8%A7%D9%84%D9%82%D8%B1%D8%B9%D8%A9-%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%B9%D9%84%D9%86%D9%8A%D8%A9-%D9%84%D9%84%D8%AD%D8%AC-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D9%84%D9%85%D9%88%D8%B3%D9%85-1447-%D9%87%D9%80%D9%80%D9%80/',
  lastVerified: '25 أغسطس 2026',
} as const;

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

export function historicalSelectionRate(level: HajjLevel): number {
  return level.availablePlaces / level.applicants;
}
