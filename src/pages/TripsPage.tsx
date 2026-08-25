import { FormEvent, useMemo, useState } from 'react';

type ServiceKey = 'flight' | 'hotel' | 'transfer' | 'car' | 'esim' | 'insurance';

const services: { key: ServiceKey; icon: string; label: string; note: string }[] = [
  { key: 'flight', icon: '✈️', label: 'طيران', note: 'رحلات ذهاب وعودة' },
  { key: 'hotel', icon: '🏨', label: 'فندق', note: 'إقامة حسب الوجهة' },
  { key: 'transfer', icon: '🚐', label: 'انتقالات', note: 'مطار وفندق وبين المدن' },
  { key: 'car', icon: '🚗', label: 'سيارة', note: 'استئجار سيارة عند الحاجة' },
  { key: 'esim', icon: '📱', label: 'eSIM', note: 'إنترنت أثناء السفر' },
  { key: 'insurance', icon: '🛡️', label: 'تأمين', note: 'عند توفر المنتج المناسب' },
];

export default function TripsPage() {
  const [selected, setSelected] = useState<Record<ServiceKey, boolean>>({ flight: true, hotel: true, transfer: false, car: false, esim: false, insurance: false });
  const [notice, setNotice] = useState(false);
  const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);

  function toggle(key: ServiceKey) {
    setSelected((current) => ({ ...current, [key]: !current[key] }));
    setNotice(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setNotice(true);
  }

  return (
    <div className="page-container content-page trips-page">
      <section className="hero trips-hero">
        <span className="unofficial-badge">واجهة تجريبية غير مفعلة للحجز</span>
        <h1>رحلات الحج والعمرة</h1>
        <p>اختر الوجهة والخدمات التي تحتاجها لتجربة شكل المقارنة فقط. لا توجد أسعار أو حجوزات حقيقية في هذه الصفحة حاليًا.</p>
      </section>

      <form className="card simulator-form trips-form" onSubmit={submit}>
        <div className="form-heading"><span aria-hidden="true">✈</span><div><h2>بيانات الرحلة</h2><p>أدخل معلومات عامة فقط؛ الصفحة لا ترسل طلب حجز حقيقي.</p></div></div>
        <div className="trips-fields">
          <div className="field"><label htmlFor="trip-from">من</label><div className="input-wrap"><input id="trip-from" placeholder="مثال: القاهرة" /></div></div>
          <div className="field"><label htmlFor="trip-to">إلى</label><div className="input-wrap"><input id="trip-to" placeholder="مثال: جدة" /></div></div>
          <div className="field"><label htmlFor="trip-out">الذهاب</label><div className="input-wrap"><input id="trip-out" type="date" /></div></div>
          <div className="field"><label htmlFor="trip-back">العودة</label><div className="input-wrap"><input id="trip-back" type="date" /></div></div>
          <div className="field"><label htmlFor="trip-travelers">المسافرون</label><div className="input-wrap"><select id="trip-travelers" defaultValue="2"><option value="1">1 مسافر</option><option value="2">2 مسافرين</option><option value="3">3 مسافرين</option><option value="4">4 مسافرين</option><option value="5">5 مسافرين</option><option value="6">6 مسافرين</option></select></div></div>
        </div>

        <section className="trips-services">
          <h2>ماذا تريد أن نحجز لك مستقبلًا؟</h2>
          <p>اختر خدمة واحدة أو أكثر لعرض شكل الباقة المقترحة.</p>
          <div className="trips-service-grid">
            {services.map((service) => {
              const active = selected[service.key];
              return <button type="button" key={service.key} onClick={() => toggle(service.key)} aria-pressed={active} className={`trips-service ${active ? 'active' : ''}`}>
                <span aria-hidden="true">{service.icon}</span><strong>{active ? '✓ ' : ''}{service.label}</strong><small>{service.note}</small>
              </button>;
            })}
          </div>
        </section>

        <div className="trips-submit-row">
          <p>تم اختيار <strong>{selectedCount}</strong> خدمة.</p>
          <button className="button button-primary" type="submit" disabled={selectedCount === 0}>اعرض شكل الرحلة</button>
        </div>

        {notice && <div className="inline-notice notice-seasonal"><strong>واجهة تجريبية فقط</strong><p>لم يتم ربط البحث أو الأسعار أو الحجز أو الدفع بعد. هذه الصفحة معروضة لاختبار تجربة المستخدم فقط.</p></div>}
      </form>

      <section className="trips-preview">
        <h2>كيف ستظهر النتائج لاحقًا؟</h2>
        <div className="trips-preview-grid">
          {[
            ['💰', 'الأرخص', 'أقل تكلفة تحقق اختياراتك.'],
            ['⭐', 'أفضل قيمة', 'موازنة بين السعر والراحة والجودة.'],
            ['🛋️', 'الأكثر راحة', 'وقت سفر أفضل وخيارات أكثر راحة.'],
          ].map(([icon, title, text]) => <article key={title} className="card"><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </div>
  );
}
