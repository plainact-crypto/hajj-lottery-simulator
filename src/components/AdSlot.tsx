import { useEffect, useState } from 'react';

interface AdSlotProps {
  onReveal: () => void;
}

const MOCK_SECONDS = 5;

export function AdSlot({ onReveal }: AdSlotProps) {
  const [watching, setWatching] = useState(false);
  const [seconds, setSeconds] = useState(MOCK_SECONDS);

  useEffect(() => {
    if (!watching) return;
    if (seconds <= 0) {
      onReveal();
      return;
    }
    const id = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [watching, seconds, onReveal]);

  return (
    <section className="ad-slot card" aria-labelledby="ad-title">
      <div className="ad-label">إعلان</div>
      <div className="ad-icon" aria-hidden="true">▧</div>
      <h2 id="ad-title">{watching ? 'جارٍ تشغيل الإعلان التجريبي' : 'شاهد إعلانًا قصيرًا لإظهار النتيجة'}</h2>
      <p>{watching ? `ستظهر النتيجة تلقائيًا خلال ${seconds} ثوانٍ` : 'النتيجة محسومة بالفعل ولن تتغير بسبب الإعلان.'}</p>
      {!watching && <button className="button button-primary" type="button" onClick={() => setWatching(true)}>▶ مشاهدة الإعلان وإظهار النتيجة</button>}
      {watching && <div className="mock-ad-player" aria-live="polite"><span>إعلان تجريبي</span><strong>{seconds}</strong></div>}
      <small>هذه محاكاة لمرحلة الإعلان أثناء التطوير. عند تفعيل الإعلانات الحقيقية يجب استخدام صيغة Rewarded/Offerwall المتوافقة، ولا يُطلب من المستخدم الضغط على محتوى الإعلان.</small>
    </section>
  );
}
