import { Link, useLocation } from 'react-router-dom';
import { SCALE_CONTENT, SCALE_CONTENT_MAP } from '../content/scaleContent';
import { NotFoundPage } from './ContentPages';

const clusterLabels = {
  rituals: 'مناسك الحج', preparation: 'الاستعداد للحج', umrah: 'العمرة', tourist: 'الحج السياحي', makkah: 'مكة والمدينة', egypt: 'الحج في مصر',
} as const;

const knownLabels: Record<string, string> = {
  '/tools': 'أدوات الحج والعمرة',
  '/tools/hajj-packing-checklist': 'قائمة تجهيز الحج التفاعلية',
  '/tools/hajj-budget-calculator': 'حاسبة ميزانية الحج',
  '/tools/egypt-hajj-eligibility-checker': 'فاحص جاهزية التقديم للحج',
  '/tools/hajj-program-comparison': 'أداة مقارنة برامج الحج',
  '/hajj-rituals': 'دليل مناسك الحج',
  '/hajj-preparation': 'دليل الاستعداد للحج',
  '/umrah': 'دليل العمرة',
  '/makkah-madinah': 'دليل مكة والمدينة',
  '/official-sources': 'المصادر الرسمية',
};

function relatedLabel(path: string) {
  return SCALE_CONTENT_MAP[path]?.title || knownLabels[path] || path.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') || 'الدليل المرتبط';
}

export function ScaleContentPage({ overridePath }: { overridePath?: string } = {}) {
  const { pathname } = useLocation();
  const clean = (overridePath || pathname).replace(/\/$/, '') || '/';
  const page = SCALE_CONTENT_MAP[clean];
  if (!page) return <NotFoundPage />;
  const siblings = SCALE_CONTENT.filter((item) => item.cluster === page.cluster && item.path !== page.path).slice(0, 6);

  return <div className="page-container content-page scale-page">
    <section className="hero scale-hero">
      <span className="unofficial-badge">{page.eyebrow}</span>
      <h1>{page.title}</h1>
      <p>{page.intro}</p>
    </section>

    <article className="card prose scale-prose">
      {page.sections.map((section) => <section key={section.heading}>
        <h2>{section.heading}</h2>
        <p>{section.body}</p>
      </section>)}

      {page.checklist && <section className="scale-checklist">
        <h2>قائمة تحقق سريعة</h2>
        <ul>{page.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>}

      <div className={`inline-notice ${page.reviewCadence === 'seasonal' ? 'notice-seasonal' : 'notice-general'}`}>
        <strong>{page.reviewCadence === 'seasonal' ? 'معلومة تحتاج مراجعة موسمية' : 'دليل عملي عام'}</strong>
        <p>{page.reviewCadence === 'seasonal' ? 'أي مواعيد أو شروط أو اشتراطات تشغيلية قد تتغير. ارجع إلى المصدر الرسمي للموسم الحالي قبل التقديم أو السداد أو السفر.' : 'هذه الصفحة للتنظيم والفهم العام. المسائل الدينية أو الصحية أو الحكومية الخاصة بحالتك تحتاج مصدرًا مختصًا.'}</p>
      </div>
    </article>

    <aside className="scale-related card">
      <span>{clusterLabels[page.cluster]}</span>
      <strong>خطوتك التالية</strong>
      <div>{page.related.map((to) => <Link to={to} key={to}><small>{to.includes('/tools/') ? 'استخدم الأداة' : 'اقرأ التالي'}</small>{relatedLabel(to)} ←</Link>)}</div>
      <strong>داخل نفس الدليل</strong>
      <div>{siblings.map((item) => <Link to={item.path} key={item.path}>{item.title}</Link>)}</div>
    </aside>
  </div>;
}
