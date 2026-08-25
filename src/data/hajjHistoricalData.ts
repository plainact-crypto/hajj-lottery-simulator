export type HistoricalSourceTier = 'official' | 'government-republished' | 'major-press';

export interface HistoricalHajjLevel {
  id: string;
  label: string;
  applicants: number;
  places: number;
  includedInLottery: boolean;
}

export interface HistoricalHajjSeason {
  hijri: string;
  gregorian: number;
  market: 'الحج السياحي المصري';
  applicants: number;
  lotteryPlaces: number;
  levels: HistoricalHajjLevel[];
  sourceName: string;
  sourceUrl: string;
  sourceTier: HistoricalSourceTier;
  sourceDate: string;
  notes: string[];
}

export const HAJJ_TOURISM_HISTORY: readonly HistoricalHajjSeason[] = [
  {
    hijri: '1445هـ',
    gregorian: 2024,
    market: 'الحج السياحي المصري',
    applicants: 58217,
    lotteryPlaces: 23000,
    levels: [
      { id: 'economy-air', label: 'اقتصادي - طيران', applicants: 37685, places: 13000, includedInLottery: true },
      { id: 'land', label: 'بري', applicants: 12347, places: 6000, includedInLottery: true },
      { id: 'five-star', label: 'خمس نجوم', applicants: 8185, places: 4000, includedInLottery: true },
    ],
    sourceName: 'وزارة السياحة والآثار — النشرة الإخبارية يناير 2024، مع تفاصيل الأعداد المنشورة عن نتيجة القرعة',
    sourceUrl: 'https://mota.gov.eg/media/vimgaq5d/mota-newsletter-ar_jan_2024.pdf',
    sourceTier: 'official',
    sourceDate: 'يناير 2024',
    notes: ['أسفرت القرعة عن 23 ألف فائز.', 'تقسيم المتقدمين والمقاعد حسب المستوى موثق في التغطيات الناقلة لبيان الوزارة.'],
  },
  {
    hijri: '1446هـ',
    gregorian: 2025,
    market: 'الحج السياحي المصري',
    applicants: 58093,
    lotteryPlaces: 31000,
    levels: [
      { id: 'economy-air', label: 'اقتصادي - طيران', applicants: 41228, places: 17000, includedInLottery: true },
      { id: 'land', label: 'بري', applicants: 8605, places: 7500, includedInLottery: true },
      { id: 'five-star', label: 'خمس نجوم', applicants: 8260, places: 6500, includedInLottery: true },
    ],
    sourceName: 'بوابة محافظة القاهرة — إعادة نشر بيان وزارة السياحة والآثار لنتيجة قرعة 1446هـ',
    sourceUrl: 'https://www.cairo.gov.eg/ar/tourism/tourism-news/2024/aa6397c0b00249b89ef9a5e63c95f549',
    sourceTier: 'government-republished',
    sourceDate: '25 ديسمبر 2024',
    notes: ['إجمالي الحصة السياحية المنشورة كان 36 ألف تأشيرة، منها 5 آلاف للحج المتميز خارج القرعة؛ لذلك يستخدم معدل القرعة هنا 31 ألف مقعد فقط.', 'إجمالي المتقدمين 58,093.'],
  },
  {
    hijri: '1447هـ',
    gregorian: 2026,
    market: 'الحج السياحي المصري',
    applicants: 114604,
    lotteryPlaces: 30500,
    levels: [
      { id: 'economy-air', label: 'اقتصادي - طيران', applicants: 87241, places: 17060, includedInLottery: true },
      { id: 'land', label: 'بري', applicants: 15326, places: 5700, includedInLottery: true },
      { id: 'five-star', label: 'خمس نجوم', applicants: 9173, places: 5000, includedInLottery: true },
      { id: 'five-star-kedana', label: 'خمس نجوم - أبراج كدانة', applicants: 2864, places: 2740, includedInLottery: true },
    ],
    sourceName: 'وزارة السياحة والآثار المصرية — نتيجة القرعة الإلكترونية العلنية للحج السياحي 1447هـ',
    sourceUrl: 'https://mota.gov.eg/ar/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-2-1-1/%D9%81%D9%8A-%D8%B6%D9%88%D8%A1-%D8%A7%D9%84%D8%B6%D9%88%D8%A7%D8%A8%D8%B7-%D9%88%D8%A7%D9%84%D9%82%D9%88%D8%A7%D8%B9%D8%AF-%D8%A7%D9%84%D9%85%D9%86%D8%B8%D9%85%D8%A9-%D9%84%D9%84%D8%AD%D8%AC-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%AA%D9%85%D8%AF%D8%A9-%D9%85%D9%86-%D9%88%D8%B2%D9%8A%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9-%D9%88%D8%A7%D9%84%D8%A2%D8%AB%D8%A7%D8%B1-%D9%88%D8%B2%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9-%D9%88%D8%A7%D9%84%D8%A2%D8%AB%D8%A7%D8%B1-%D8%AA%D8%B9%D9%84%D9%86-%D8%B9%D9%86-%D9%86%D8%AA%D9%8A%D8%AC%D8%A9-%D8%A7%D9%84%D9%82%D8%B1%D8%B9%D8%A9-%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%B9%D9%84%D9%86%D9%8A%D8%A9-%D9%84%D9%84%D8%AD%D8%AC-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D9%84%D9%85%D9%88%D8%B3%D9%85-1447-%D9%87%D9%80%D9%80%D9%80/',
    sourceTier: 'official',
    sourceDate: '4 نوفمبر 2025',
    notes: ['شهد الموسم 114,604 متقدمين، بزيادة كبيرة عن الموسم السابق.', 'استحدث مستوى خمس نجوم - أبراج كدانة.'],
  },
] as const;

export function selectionRate(places: number, applicants: number): number {
  return applicants > 0 ? places / applicants : 0;
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat('ar-EG', { style: 'percent', maximumFractionDigits: 1 }).format(rate);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ar-EG').format(value);
}
