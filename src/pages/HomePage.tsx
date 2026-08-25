import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CompanyAutocomplete } from '../components/CompanyAutocomplete';
import { LoadingDraw } from '../components/LoadingDraw';
import { ResultCard } from '../components/ResultCard';
import { DRAW_ANIMATION_MS } from '../config';
import { HAJJ_LEVELS, getHajjLevel, type HajjLevelId } from '../data/hajjLevels';
import { INITIAL_ATTEMPT, resetAttempt, type AttemptState } from '../utils/attempt';
import { getAttemptStats, recordAttempt, type AttemptStats } from '../utils/attemptStats';
import { trackFunnelEvent } from '../utils/analytics';
import { isWinningDraw, secureRandom } from '../utils/lottery';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function HomePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [stats, setStats] = useState<AttemptStats | null>(null);
  const [levelId, setLevelId] = useState<HajjLevelId>('economy-air');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; company?: string }>({});
  const [attempt, setAttempt] = useState<AttemptState>(INITIAL_ATTEMPT);
  const [saving, setSaving] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const loadStats = async () => {
    if (!EMAIL_RE.test(email.trim())) return;
    const currentStats = await getAttemptStats(email);
    setStats(currentStats);
  };

  const startDraw = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'من فضلك أدخل الاسم الكامل';
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = 'من فضلك أدخل بريدًا إلكترونيًا صحيحًا';
    if (!company.trim()) nextErrors.company = 'من فضلك اختر شركة سياحة من القائمة';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    trackFunnelEvent('simulator_started', { levelId, marketingOptIn });
    const won = isWinningDraw(levelId, secureRandom());

    setSaving(true);
    const nextStats = await recordAttempt(email, marketingOptIn, won);
    setSaving(false);
    setStats(nextStats);
    trackFunnelEvent(nextStats.persistedRemotely ? 'attempt_persisted' : 'attempt_local_fallback', {
      levelId,
      marketingOptIn,
      persistedRemotely: nextStats.persistedRemotely,
    });

    setAttempt({ stage: 'drawing', won });
    timeoutRef.current = window.setTimeout(() => {
      setAttempt({ stage: 'result', won });
      trackFunnelEvent('result_viewed', { levelId, marketingOptIn, persistedRemotely: nextStats.persistedRemotely });
    }, DRAW_ANIMATION_MS);
  };

  const retry = () => {
    window.clearTimeout(timeoutRef.current);
    trackFunnelEvent('retry_clicked', { levelId, marketingOptIn, persistedRemotely: stats?.persistedRemotely });
    setAttempt(resetAttempt());
    setErrors({});
  };

  const firstName = name.trim().split(/\s+/)[0] || 'ضيفنا';
  const level = getHajjLevel(levelId);

  return (
    <div className="home-page page-container">
      <section className="hero">
        <div className="stats-strip" aria-label="سجل المحاولات">
          <div><span>المحاولات</span><strong>{stats?.attempts ?? 0}</strong></div>
          <div><span>فوز</span><strong>{stats?.wins ?? 0}</strong></div>
          <div><span>خسارة</span><strong>{stats?.losses ?? 0}</strong></div>
        </div>
        <div className="hero-emblem" aria-hidden="true"><span>🕋</span></div>
        <span className="unofficial-badge">محاكاة غير رسمية</span>
        <h1>محاكي قرعة الحج ودليل معلومات الحج</h1>
        <p>محاكاة تعليمية مبنية على بيانات الحج السياحي المصرية 1447هـ / 2026م، مع أدلة تشرح طرق التقديم والاحتمالات والمصادر الرسمية.</p>
      </section>

      <article className="card prose">
        <h2>ابدأ بالمعلومة الصحيحة قبل المحاكاة</h2>
        <p>هذا الموقع ليس جهة تسجيل ولا يعرض نتيجة حكومية. هدفه أن يساعدك على فهم معنى القرعة، والفرق بين مسارات الحج في مصر، وكيف تقرأ الأرقام المنشورة قبل تجربة المحاكاة الترفيهية.</p>
        <p>إذا كنت تبحث عن تسجيل أو نتيجة حقيقية، استخدم الجهة الرسمية التي تتبع لها. وإذا كنت تريد فهم الفكرة أولًا، ابدأ من <Link to="/guides">الأدلة والمقالات</Link> أو <Link to="/how-it-works">شرح طريقة عمل المحاكاة</Link>.</p>
      </article>

      {attempt.stage === 'form' && (
        <form className="simulator-form card" onSubmit={startDraw} noValidate>
          <div className="form-heading">
            <span aria-hidden="true">✧</span>
            <div><h2>جرّب المحاكاة</h2><p>المحاولات مفتوحة، ويُسجَّل لك إجمالي الفوز والخسارة.</p></div>
          </div>
          <div className="field">
            <label htmlFor="full-name">الاسم الكامل</label>
            <div className="input-wrap"><span aria-hidden="true">♙</span><input id="full-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} /></div>
            {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">البريد الإلكتروني</label>
            <div className="input-wrap"><span aria-hidden="true">@</span><input id="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setStats(null); }} onBlur={loadStats} placeholder="name@example.com" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} /></div>
            {errors.email && <span id="email-error" className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="hajj-level">مستوى الحج</label>
            <div className="input-wrap select-wrap"><span aria-hidden="true">◇</span><select id="hajj-level" value={levelId} onChange={(event) => setLevelId(event.target.value as HajjLevelId)}>{HAJJ_LEVELS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></div>
          </div>
          <CompanyAutocomplete value={company} onChange={setCompany} error={errors.company} />
          <label className="consent-row">
            <input type="checkbox" checked={marketingOptIn} onChange={(event) => setMarketingOptIn(event.target.checked)} />
            <span>أوافق على استلام أخبار وتحديثات الحج من الموقع (اختياري).</span>
          </label>
          <button className="button button-primary draw-button" type="submit" disabled={saving}>{saving ? 'جارٍ تسجيل المحاولة...' : '🕋 دخول القرعة'}</button>
          <p className="privacy-note">🔒 يُستخدم البريد لحفظ سجل محاولاتك وإجمالي الفوز والخسارة. الاشتراك في الرسائل اختياري ومنفصل عن دخول المحاكاة.</p>
        </form>
      )}
      {attempt.stage === 'drawing' && <LoadingDraw />}
      {attempt.stage === 'result' && attempt.won !== null && <ResultCard won={attempt.won} firstName={firstName} level={level.label} company={company} stats={stats} onRetry={retry} />}
      <div className="inline-notice"><strong>تذكير</strong><p>النتيجة للترفيه فقط ولا تُعد تقديمًا للحج أو نتيجة رسمية.</p></div>

      <article className="card prose">
        <h2>ماذا ستجد في الموقع؟</h2>
        <h3>فهم طرق الحج في مصر</h3>
        <p>الحج السياحي وحج القرعة وحج الجمعيات الأهلية مسارات تنظيمية مختلفة. لكل مسار جهة وقواعد ومواعيد خاصة به، ولا ينبغي استخدام معلومات أحدها باعتبارها تعليمات للآخر.</p>
        <h3>قراءة النسب دون تضليل</h3>
        <p>نسبة المقاعد إلى المتقدمين مفيدة لفهم شدة المنافسة، لكنها لا تضمن نتيجة فردية. المحاكي يوضح هذا الفرق ويشرح الافتراضات المستخدمة في الحساب.</p>
        <h3>الوصول إلى المصادر الأصلية</h3>
        <p>الصفحات التعليمية تربط بالمصادر الرسمية ذات الصلة حتى تتمكن من التحقق من التعليمات الموسمية بدل الاعتماد على منشور قديم أو رسالة متداولة.</p>
      </article>

      <article className="card prose">
        <h2>أدلة مقترحة</h2>
        <ul>
          <li><Link to="/guides/egypt-hajj-paths-explained">طرق التقديم للحج في مصر: السياحي والقرعة والجمعيات</Link></li>
          <li><Link to="/guides/how-hajj-lottery-probability-works">كيف تُفهم احتمالات الفوز في قرعة الحج؟</Link></li>
          <li><Link to="/guides/before-you-apply-hajj-checklist">قبل التقديم للحج: ما الذي يجب التحقق منه؟</Link></li>
          <li><Link to="/guides/hajj-result-safety-guide">كيف تتحقق من نتيجة الحج بأمان؟</Link></li>
          <li><Link to="/guides/hajj-official-sources-guide">كيف تميّز المصدر الرسمي من غير الرسمي؟</Link></li>
        </ul>
        <p><Link to="/guides">عرض كل الأدلة والمقالات ←</Link></p>
      </article>
    </div>
  );
}