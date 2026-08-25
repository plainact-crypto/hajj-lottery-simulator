import { FormEvent, useState } from 'react';
import { trackFunnelEvent } from '../utils/analytics';

type Answer = 'yes' | 'no' | 'unknown';
type TripMode = 'air' | 'land';

type Check = {
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
};

const OFFICIAL_SOURCE = 'https://mota.gov.eg/ar/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-2-1-1/%D9%88%D8%B2%D9%8A%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9-%D9%88%D8%A7%D9%84%D8%A2%D8%AB%D8%A7%D8%B1-%D9%8A%D8%B9%D8%AA%D9%85%D8%AF-%D8%B6%D9%88%D8%A7%D8%A8%D8%B7-%D8%AA%D9%86%D9%81%D9%8A%D8%B0-%D8%B1%D8%AD%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D9%85%D8%B1%D8%A9-%D9%84%D9%85%D9%88%D8%B3%D9%85-1448%D9%87%D9%80/';

function answerCheck(answer: Answer, label: string, yesDetail: string, noDetail: string): Check {
  if (answer === 'yes') return { label, status: 'pass', detail: yesDetail };
  if (answer === 'no') return { label, status: 'fail', detail: noDetail };
  return { label, status: 'warn', detail: 'المعلومة غير مؤكدة. اطلب إثباتها من شركة السياحة قبل الحجز أو السداد.' };
}

export default function UmrahProgramCheckerPage() {
  const [licensedCompany, setLicensedCompany] = useState<Answer>('unknown');
  const [rafiqExplained, setRafiqExplained] = useState<Answer>('unknown');
  const [durationDays, setDurationDays] = useState('');
  const [peakException, setPeakException] = useState(false);
  const [meccaDistance, setMeccaDistance] = useState('');
  const [meccaShuttle, setMeccaShuttle] = useState<Answer>('unknown');
  const [medinaDistance, setMedinaDistance] = useState('');
  const [medinaNights, setMedinaNights] = useState('');
  const [tripMode, setTripMode] = useState<TripMode>('air');
  const [busYear, setBusYear] = useState('');
  const [checks, setChecks] = useState<Check[] | null>(null);

  const runCheck = (event: FormEvent) => {
    event.preventDefault();
    trackFunnelEvent('umrah_checker_started');
    const next: Check[] = [
      answerCheck(licensedCompany, 'شركة السياحة مرخصة', 'هذه نقطة أساسية؛ الضوابط تقصر تنفيذ رحلات العمرة على شركات السياحة المرخصة.', 'توقف قبل الدفع. الضوابط تحذر من السماسرة والوسطاء والكيانات غير المرخصة.'),
      answerCheck(rafiqExplained, 'تطبيق رفيق والمستندات', 'الشركة شرحت لك استخدام تطبيق رفيق ورفع عقد الرحلة وإيصال السداد.', 'اطلب من الشركة شرح تطبيق رفيق ومتطلبات رفع عقد الرحلة وإيصال السداد قبل السفر.'),
    ];

    const duration = Number(durationDays);
    if (!Number.isFinite(duration) || duration <= 0) next.push({ label: 'مدة البرنامج', status: 'warn', detail: 'أدخل عدد أيام البرنامج حتى يمكن فحص المدة.' });
    else {
      const max = peakException ? 35 : 15;
      next.push(duration <= max ? { label: 'مدة البرنامج', status: 'pass', detail: `المدة ${duration} يوم، داخل الحد الأقصى المحدد لهذه الحالة (${max} يوم).` } : { label: 'مدة البرنامج', status: 'fail', detail: `المدة ${duration} يوم تتجاوز الحد الأقصى المحدد لهذه الحالة (${max} يوم). راجع الشركة قبل الدفع.` });
    }

    const mecca = Number(meccaDistance);
    if (!Number.isFinite(mecca) || mecca < 0) next.push({ label: 'سكن مكة', status: 'warn', detail: 'أدخل المسافة التقريبية بين الفندق وساحة الحرم بالمتر.' });
    else if (mecca > 3000) next.push({ label: 'سكن مكة', status: 'fail', detail: 'المسافة المدخلة تتجاوز 3000 متر، وهي أعلى من الحد المذكور في ضوابط الموسم.' });
    else if (mecca > 1250) next.push(answerCheck(meccaShuttle, 'سكن مكة والنقل الترددي', 'المسافة أعلى من 1250 متر وأفدت بوجود نقل ترددي؛ تأكد أيضاً أن الفندق على شارع رئيسي وفي منطقة تتوافر بها الخدمات.', 'عند تجاوز 1250 متر تشترط الضوابط وقوع الفندق على شارع رئيسي وفي منطقة خدمات مع توفير نقل ترددي للحرم.'));
    else next.push({ label: 'سكن مكة', status: 'pass', detail: 'المسافة المدخلة لا تتجاوز 1250 متر.' });

    const medina = Number(medinaDistance);
    const nights = Number(medinaNights);
    if (!Number.isFinite(medina) || medina < 0) next.push({ label: 'سكن المدينة', status: 'warn', detail: 'أدخل المسافة التقريبية بين الفندق وساحة الحرم النبوي بالمتر.' });
    else if (medina > 1400) next.push({ label: 'سكن المدينة', status: 'fail', detail: 'المسافة المدخلة تتجاوز 1400 متر، وهي أعلى من الحد المذكور في ضوابط الموسم.' });
    else if (!Number.isFinite(nights) || nights < 1) next.push({ label: 'سكن المدينة', status: 'fail', detail: 'الضوابط حددت حداً أدنى للإقامة في المدينة المنورة بليلة واحدة.' });
    else next.push({ label: 'سكن المدينة', status: 'pass', detail: 'المسافة والإقامة المدخلتان لا تتجاوزان/تقلان عن الحدود الأساسية المذكورة.' });

    if (tripMode === 'land') {
      const year = Number(busYear);
      if (!Number.isFinite(year) || year <= 0) next.push({ label: 'الحافلة البرية', status: 'warn', detail: 'أدخل موديل الحافلة؛ ضوابط 1448 رفعت الحد الأدنى إلى موديل 2022.' });
      else if (year < 2022) next.push({ label: 'الحافلة البرية', status: 'fail', detail: 'موديل الحافلة أقدم من 2022؛ راجع الشركة قبل الحجز.' });
      else next.push({ label: 'الحافلة البرية', status: 'pass', detail: 'موديل الحافلة المدخل 2022 أو أحدث. تبقى اشتراطات الفحص والصلاحية والتتبع مسؤولية الشركة والجهات المختصة.' });
    }

    setChecks(next);
    trackFunnelEvent('umrah_checker_completed');
  };

  const failures = checks?.filter((item) => item.status === 'fail').length ?? 0;
  const warnings = checks?.filter((item) => item.status === 'warn').length ?? 0;

  return (
    <div className="page-container content-page">
      <section className="hero"><span className="unofficial-badge">أداة مستقلة غير رسمية</span><h1>فاحص برنامج العمرة 1448هـ</h1><p>راجع أهم نقاط برنامج العمرة قبل الحجز وفق الضوابط المصرية المعلنة لموسم 1448هـ.</p></section>
      <div className="inline-notice notice-seasonal"><strong>مهم</strong><p>هذه أداة مساعدة وليست اعتماداً حكومياً أو بديلاً عن التحقق من بوابة العمرة والجهات الرسمية. لا تدخل بيانات شخصية أو أرقام جوازات.</p></div>
      <form className="simulator-form card" onSubmit={runCheck}>
        <div className="form-heading"><span aria-hidden="true">✓</span><div><h2>بيانات العرض الذي أمامك</h2><p>اختر «غير متأكد» لأي معلومة لم يثبتها لك البائع.</p></div></div>
        <div className="field"><label htmlFor="licensed">هل الشركة السياحية مرخصة؟</label><div className="input-wrap select-wrap"><select id="licensed" value={licensedCompany} onChange={(e) => setLicensedCompany(e.target.value as Answer)}><option value="unknown">غير متأكد</option><option value="yes">نعم</option><option value="no">لا</option></select></div></div>
        <div className="field"><label htmlFor="rafiq">هل شرحت لك الشركة تطبيق «رفيق» ورفع عقد الرحلة وإيصال السداد؟</label><div className="input-wrap select-wrap"><select id="rafiq" value={rafiqExplained} onChange={(e) => setRafiqExplained(e.target.value as Answer)}><option value="unknown">غير متأكد</option><option value="yes">نعم</option><option value="no">لا</option></select></div></div>
        <div className="field"><label htmlFor="duration">مدة البرنامج بالأيام</label><div className="input-wrap"><input id="duration" inputMode="numeric" type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} /></div></div>
        <label className="consent-row"><input type="checkbox" checked={peakException} onChange={(e) => setPeakException(e.target.checked)} /><span>البرنامج منفذ خلال الفترة الاستثنائية من 15 شعبان حتى 17 رمضان (يسمح حتى 35 يوماً بدلاً من 15).</span></label>
        <div className="field"><label htmlFor="mecca-distance">المسافة بين فندق مكة وساحة الحرم (متر)</label><div className="input-wrap"><input id="mecca-distance" inputMode="numeric" type="number" min="0" value={meccaDistance} onChange={(e) => setMeccaDistance(e.target.value)} /></div></div>
        {Number(meccaDistance) > 1250 && <div className="field"><label htmlFor="shuttle">هل يوجد نقل ترددي (شاتل باص) للحرم؟</label><div className="input-wrap select-wrap"><select id="shuttle" value={meccaShuttle} onChange={(e) => setMeccaShuttle(e.target.value as Answer)}><option value="unknown">غير متأكد</option><option value="yes">نعم</option><option value="no">لا</option></select></div></div>}
        <div className="field"><label htmlFor="medina-distance">المسافة بين فندق المدينة وساحة الحرم النبوي (متر)</label><div className="input-wrap"><input id="medina-distance" inputMode="numeric" type="number" min="0" value={medinaDistance} onChange={(e) => setMedinaDistance(e.target.value)} /></div></div>
        <div className="field"><label htmlFor="medina-nights">عدد ليالي الإقامة في المدينة</label><div className="input-wrap"><input id="medina-nights" inputMode="numeric" type="number" min="0" value={medinaNights} onChange={(e) => setMedinaNights(e.target.value)} /></div></div>
        <div className="field"><label htmlFor="mode">طريقة السفر</label><div className="input-wrap select-wrap"><select id="mode" value={tripMode} onChange={(e) => setTripMode(e.target.value as TripMode)}><option value="air">جوي</option><option value="land">بري</option></select></div></div>
        {tripMode === 'land' && <div className="field"><label htmlFor="bus-year">موديل الحافلة</label><div className="input-wrap"><input id="bus-year" inputMode="numeric" type="number" min="2000" max="2035" value={busYear} onChange={(e) => setBusYear(e.target.value)} placeholder="مثال: 2024" /></div></div>}
        <button className="button button-primary draw-button" type="submit">فحص البرنامج</button>
      </form>

      {checks && <section className={`card checker-results ${failures ? 'has-failures' : warnings ? 'has-warnings' : 'all-pass'}`} aria-live="polite">
        <h2>{failures ? `يوجد ${failures} تنبيه يحتاج مراجعة` : warnings ? 'لا توجد مخالفة واضحة في المدخلات، لكن توجد معلومات ناقصة' : 'المؤشرات الأساسية المدخلة متوافقة مبدئياً'}</h2>
        <p>النتيجة إرشادية فقط وتعتمد على المعلومات التي أدخلتها.</p>
        <div className="checker-result-list">
          {checks.map((item, index) => <div key={`${item.label}-${index}`} className={`inline-notice checker-status status-${item.status}`}><strong><span aria-hidden="true">{item.status === 'pass' ? '✓' : item.status === 'fail' ? '!' : '؟'}</span>{item.label}</strong><p>{item.detail}</p></div>)}
        </div>
      </section>}

      <section className="card checker-source"><h2>المصدر الرسمي</h2><p>اعتمدت وزارة السياحة والآثار المصرية ضوابط تنفيذ رحلات العمرة لموسم 1448هـ بتاريخ 15 يوليو 2026.</p><a className="button" href={OFFICIAL_SOURCE} target="_blank" rel="noreferrer" onClick={() => trackFunnelEvent('official_source_clicked')}>راجع خبر الوزارة الرسمي</a></section>
    </div>
  );
}
