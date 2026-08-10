import { FormEvent, useEffect, useRef, useState } from 'react';
import { CompanyAutocomplete } from '../components/CompanyAutocomplete';
import { LoadingDraw } from '../components/LoadingDraw';
import { ResultCard } from '../components/ResultCard';
import { DRAW_ANIMATION_MS } from '../config';
import { HAJJ_LEVELS, getHajjLevel, type HajjLevelId } from '../data/hajjLevels';
import { INITIAL_ATTEMPT, resetAttempt, type AttemptState } from '../utils/attempt';
import { getAttemptStats, recordAttempt, type AttemptStats } from '../utils/attemptStats';
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

    // The outcome is fixed here, before any advertisement/reward step is displayed.
    const won = isWinningDraw(levelId, secureRandom());

    setSaving(true);
    const nextStats = await recordAttempt(email, marketingOptIn, won);
    setSaving(false);
    setStats(nextStats);

    setAttempt({ stage: 'drawing', won });
    timeoutRef.current = window.setTimeout(() => setAttempt({ stage: 'result', won }), DRAW_ANIMATION_MS);
  };

  const retry = () => {
    window.clearTimeout(timeoutRef.current);
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
        <h1>محاكي قرعة الحج</h1>
        <p>جرّب محاكاة مبنية على بيانات قرعة الحج السياحي المصرية 1447هـ / 2026م</p>
      </section>

      {attempt.stage === 'form' && (
        <form className="simulator-form card" onSubmit={startDraw} noValidate>
          <div className="form-heading">
            <span aria-hidden="true">✧</span>
            <div><h2>بيانات المحاكاة</h2><p>المحاولات مفتوحة، ويُسجَّل لك إجمالي الفوز والخسارة.</p></div>
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
    </div>
  );
}

