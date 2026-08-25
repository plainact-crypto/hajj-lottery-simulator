import { Link, useLocation } from 'react-router-dom';
import { SCALE_CONTENT_MAP } from '../content/scaleContent';
import { NotFoundPage } from './ContentPages';

const clusterLabels = {
  rituals: 'مناسك الحج', preparation: 'الاستعداد للحج', umrah: 'العمرة', tourist: 'الحج السياحي', makkah: 'مكة والمدينة', egypt: 'الحج في مصر',
} as const;

export function ScaleContentPage() {
  const { pathname } = useLocation();
  const clean = pathname.replace(/\/$/, '') || '/';
  const page = SCALE_CONTENT_MAP[clean];
  if (!page) return <NotFoundPage />;

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

      <div className="inline-notice">
        <strong>{page.reviewCadence === 'seasonal' ? 'معلومة تحتاج مراجعة موسمية' : 'دليل عملي عام'}</strong>
        <p>{page.reviewCadence === 'seasonal' ? 'أي مواعيد أو شروط أو اشتراطات تشغيلية قد تتغير. ارجع إلى المصدر الرسمي للموسم الحالي قبل التقديم أو السداد أو السفر.' : 'هذه الصفحة للتنظيم والفهم العام. المسائل الدينية أو الصحية أو الحكومية الخاصة بحالتك تحتاج مصدرًا مختصًا.'}</p>
      </div>
    </article>

    <aside className="scale-related card">
      <span>{clusterLabels[page.cluster]}</span>
      <strong>خطوتك التالية</strong>
      <div>{page.related.map((to) => <Link to={to} key={to}>{to.includes('/tools/') ? 'استخدم الأداة المرتبطة' : 'اقرأ الدليل المرتبط'} ←</Link>)}</div>
    </aside>
  </div>;
}
