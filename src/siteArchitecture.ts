export type RouteDisposition = 'keep' | 'redirect-after-target' | 'legacy' | 'migrate-per-page' | 'defer';

export const PRIMARY_NAV = [
  { path: '/egypt-hajj/', label: 'الحج في مصر' },
  { path: '/hajj-lottery/', label: 'حج القرعة' },
  { path: '/tourist-hajj/', label: 'الحج السياحي' },
  { path: '/hajj-rituals/', label: 'مناسك الحج' },
  { path: '/hajj-preparation/', label: 'الاستعداد للحج' },
  { path: '/umrah/', label: 'العمرة' },
  { path: '/makkah-madinah/', label: 'مكة والمدينة' },
  { path: '/tools/', label: 'الأدوات' },
] as const;

export const FOOTER_TRUST_NAV = [
  { path: '/about/', label: 'عن الموقع' },
  { path: '/authors/', label: 'فريق التحرير' },
  { path: '/editorial-policy/', label: 'سياسة التحرير' },
  { path: '/sources-policy/', label: 'سياسة المصادر' },
  { path: '/corrections-policy/', label: 'التصحيحات' },
  { path: '/contact/', label: 'تواصل معنا' },
  { path: '/privacy/', label: 'الخصوصية' },
  { path: '/disclaimer/', label: 'إخلاء المسؤولية' },
  { path: '/sources/', label: 'المصادر الرسمية' },
] as const;

export const CURRENT_ROUTE_MIGRATIONS: ReadonlyArray<{
  from: string;
  to: string | null;
  disposition: RouteDisposition;
}> = [
  { from: '/', to: '/', disposition: 'keep' },
  { from: '/how-it-works', to: '/hajj-lottery/how-it-works/', disposition: 'redirect-after-target' },
  { from: '/hajj-levels', to: '/tourist-hajj/levels/', disposition: 'redirect-after-target' },
  { from: '/rituals', to: '/hajj-rituals/', disposition: 'redirect-after-target' },
  { from: '/hajj-systems-world', to: null, disposition: 'legacy' },
  { from: '/articles-sources', to: '/sources/', disposition: 'redirect-after-target' },
  { from: '/guides', to: '/guides/', disposition: 'keep' },
  { from: '/guides/:slug', to: null, disposition: 'migrate-per-page' },
  { from: '/umrah-1448-checker', to: '/tools/umrah-program-checker/', disposition: 'redirect-after-target' },
  { from: '/trips', to: '/tools/hajj-program-comparison/', disposition: 'defer' },
  { from: '/about', to: '/about/', disposition: 'keep' },
  { from: '/privacy', to: '/privacy/', disposition: 'keep' },
  { from: '/disclaimer', to: '/disclaimer/', disposition: 'keep' },
] as const;

export const TOPIC_OWNERS = {
  egyptHajj: '/egypt-hajj/',
  hajjLottery: '/hajj-lottery/',
  touristHajj: '/tourist-hajj/',
  rituals: '/hajj-rituals/',
  preparation: '/hajj-preparation/',
  umrah: '/umrah/',
  makkahMadinah: '/makkah-madinah/',
  tools: '/tools/',
  data: '/data/',
  sources: '/sources/',
} as const;

/**
 * Phase 2 deliberately does not wire future routes into React Router yet.
 * Empty or thin category shells must not become indexable just to reserve URLs.
 * Phase 3 will implement canonical/redirect/rendering behavior as substantive targets go live.
 */
