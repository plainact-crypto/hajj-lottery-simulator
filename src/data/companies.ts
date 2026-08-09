/**
 * أسماء تجريبية لأغراض تشغيل واجهة البحث فقط، وليست قائمة اعتماد رسمية.
 * لاستبدالها لاحقًا، احتفظ بالشكل { id, name }.
 */
export interface TourismCompany {
  id: string;
  name: string;
}

export const TOURISM_COMPANIES: readonly TourismCompany[] = [
  { id: 'sample-01', name: 'الرحاب للسياحة' },
  { id: 'sample-02', name: 'الصفا للسياحة' },
  { id: 'sample-03', name: 'طيبة للسياحة' },
  { id: 'sample-04', name: 'المروة للرحلات' },
  { id: 'sample-05', name: 'النور للسياحة' },
  { id: 'sample-06', name: 'الهدى للسياحة' },
  { id: 'sample-07', name: 'زمزم للسياحة' },
  { id: 'sample-08', name: 'الكوثر للرحلات' },
  { id: 'sample-09', name: 'روضة الحرمين للسياحة' },
  { id: 'sample-10', name: 'مناسك للسياحة' },
  { id: 'sample-11', name: 'بوابة مكة للسياحة' },
  { id: 'sample-12', name: 'المدينة للسياحة' },
] as const;
