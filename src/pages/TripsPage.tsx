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
  const [selected, setSelected] = useState<Record<ServiceKey, boolean>>({
    flight: true,
    hotel: true,
    transfer: false,
    car: false,
    esim: false,
    insurance: false,
  });
  const [notice, setNotice] = useState(false);

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  function toggle(key: ServiceKey) {
    setSelected((current) => ({ ...current, [key]: !current[key] }));
    setNotice(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setNotice(true);
  }

  const shell: React.CSSProperties = {
    direction: 'rtl',
    maxWidth: 1120,
    margin: '0 auto',
    padding: '32px 18px 64px',
  };

  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e7e5df',
    borderRadius: 22,
    boxShadow: '0 12px 34px rgba(0,0,0,.06)',
  };

  const input: React.CSSProperties = {
    width: '100%',
    minHeight: 48,
    border: '1px solid #d7d4cc',
    borderRadius: 12,
    padding: '0 13px',
    fontSize: 15,
    background: '#fff',
    color: '#1d1d1b',
    boxSizing: 'border-box',
  };

  return (
    <main style={shell}>
      <section style={{ ...card, overflow: 'hidden' }}>
        <div
          style={{
            padding: '34px 28px',
            background: 'linear-gradient(135deg,#0b5d49 0%,#0d755b 100%)',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 8 }}>✈️</div>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px,5vw,44px)', lineHeight: 1.2 }}>
            رحلات
          </h1>
          <p style={{ margin: '12px 0 0', maxWidth: 760, lineHeight: 1.9, opacity: .94 }}>
            اختر وجهتك والخدمات التي تحتاجها فقط. في المرحلة التالية سيبحث النظام
            تلقائيًا عن أفضل تركيبة ويعرضها لك كباقة واحدة.
          </p>
        </div>

        <form onSubmit={submit} style={{ padding: 28 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
              gap: 14,
            }}
          >
            <label>
              <span style={{ display: 'block', marginBottom: 7, fontWeight: 700 }}>من</span>
              <input style={input} placeholder="مثال: القاهرة" />
            </label>

            <label>
              <span style={{ display: 'block', marginBottom: 7, fontWeight: 700 }}>إلى</span>
              <input style={input} placeholder="مثال: جدة" />
            </label>

            <label>
              <span style={{ display: 'block', marginBottom: 7, fontWeight: 700 }}>الذهاب</span>
              <input style={input} type="date" />
            </label>

            <label>
              <span style={{ display: 'block', marginBottom: 7, fontWeight: 700 }}>العودة</span>
              <input style={input} type="date" />
            </label>

            <label>
              <span style={{ display: 'block', marginBottom: 7, fontWeight: 700 }}>المسافرون</span>
              <select style={input} defaultValue="2">
                <option value="1">1 مسافر</option>
                <option value="2">2 مسافرين</option>
                <option value="3">3 مسافرين</option>
                <option value="4">4 مسافرين</option>
                <option value="5">5 مسافرين</option>
                <option value="6">6 مسافرين</option>
              </select>
            </label>
          </div>

          <div style={{ marginTop: 30 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 22 }}>ماذا تريد أن نحجز لك؟</h2>
            <p style={{ margin: '0 0 16px', color: '#68665f' }}>
              اختر أي مجموعة تناسبك — خدمة واحدة أو رحلة كاملة.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))',
                gap: 12,
              }}
            >
              {services.map((service) => {
                const active = selected[service.key];
                return (
                  <button
                    type="button"
                    key={service.key}
                    onClick={() => toggle(service.key)}
                    aria-pressed={active}
                    style={{
                      textAlign: 'right',
                      border: active ? '2px solid #0d755b' : '1px solid #dedbd3',
                      background: active ? '#eef8f4' : '#fff',
                      borderRadius: 16,
                      padding: 16,
                      cursor: 'pointer',
                      color: '#1d1d1b',
                    }}
                  >
                    <div style={{ fontSize: 28 }}>{service.icon}</div>
                    <strong style={{ display: 'block', marginTop: 7, fontSize: 16 }}>
                      {active ? '✓ ' : ''}{service.label}
                    </strong>
                    <span style={{ display: 'block', marginTop: 5, fontSize: 12, color: '#77746d', lineHeight: 1.6 }}>
                      {service.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ color: '#65635d', fontSize: 14 }}>
              تم اختيار <strong>{selectedCount}</strong> خدمة
              {selectedCount >= 3 && (
                <span style={{ display: 'block', marginTop: 4, color: '#0b6c52', fontWeight: 700 }}>
                  🎁 الباقات المتكاملة قد تتضمن هدية تلقائية عند تفعيل الحجز الحقيقي.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={selectedCount === 0}
              style={{
                minHeight: 50,
                border: 0,
                borderRadius: 14,
                padding: '0 24px',
                background: selectedCount ? '#0d755b' : '#bbb',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
                cursor: selectedCount ? 'pointer' : 'not-allowed',
              }}
            >
              ابحث لي عن أفضل رحلة
            </button>
          </div>

          {notice && (
            <div
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 14,
                background: '#fff8e8',
                border: '1px solid #f0dca7',
                lineHeight: 1.8,
              }}
            >
              <strong>واجهة تجريبية فقط حاليًا.</strong>
              <div style={{ color: '#625b4a', marginTop: 3 }}>
                لم يتم ربط البحث أو الأسعار أو الحجز بعد. سنستخدم هذه الشاشة لاختبار أول رحلة حقيقية في المرحلة التالية.
              </div>
            </div>
          )}
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 24, margin: '0 0 14px' }}>كيف ستظهر النتائج لاحقًا؟</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 14,
          }}
        >
          {[
            ['💰', 'الأرخص', 'أقل تكلفة تحقق اختياراتك.'],
            ['⭐', 'أفضل قيمة', 'موازنة بين السعر والراحة والجودة.'],
            ['🛋️', 'الأكثر راحة', 'وقت سفر أفضل وخيارات أكثر راحة.'],
          ].map(([icon, title, text]) => (
            <article key={title} style={{ ...card, padding: 20 }}>
              <div style={{ fontSize: 30 }}>{icon}</div>
              <h3 style={{ margin: '8px 0 5px' }}>{title}</h3>
              <p style={{ margin: 0, color: '#6c6962', lineHeight: 1.7 }}>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <p style={{ marginTop: 22, color: '#77746d', fontSize: 13, lineHeight: 1.8 }}>
        تنبيه: هذه الصفحة حاليًا نموذج واجهة فقط، ولا تعرض أسعارًا حقيقية ولا تنفذ أي حجز أو دفع.
      </p>
    </main>
  );
}
