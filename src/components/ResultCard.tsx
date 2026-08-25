import { useMemo } from 'react';
import { SUPPORT_URL } from '../config';
import { getRandomAuthenticDua } from '../data/authenticDuas';
import type { AttemptStats } from '../utils/attemptStats';

interface Props {
  won: boolean;
  firstName: string;
  level: string;
  company: string;
  historicalRate: string;
  seasonLabel: string;
  stats: AttemptStats | null;
  onRetry: () => void;
}

export function ResultCard({ won, firstName, level, company, historicalRate, seasonLabel, stats, onRetry }: Props) {
  const dua = useMemo(() => getRandomAuthenticDua(), []);
  return (
    <section className={`result-card card ${won ? 'winner' : 'not-winner'}`} aria-live="polite">
      <div className="result-symbol" aria-hidden="true">{won ? '✦' : '☾'}</div>
      <span className="result-label">نتيجة محاكاة تعليمية</span>
      <h2>{won ? `مبروك يا ${firstName} ✨` : `ربنا يكتبها لك قريبًا يا ${firstName} 🤲`}</h2>
      <p className="result-lead">{won ? 'اختارتك هذه المحاولة العشوائية داخل المحاكي.' : 'لم تختارك هذه المحاولة العشوائية داخل المحاكي.'}</p>
      <dl className="result-details">
        <div><dt>الموسم المرجعي</dt><dd>{seasonLabel}</dd></div>
        <div><dt>مستوى الحج</dt><dd>{level}</dd></div>
        <div><dt>نسبة المقاعد التاريخية</dt><dd>{historicalRate}</dd></div>
        <div><dt>شركة السياحة</dt><dd>{company} — لا تؤثر في النتيجة</dd></div>
        {stats && <div><dt>إجمالي المحاولات</dt><dd>{stats.attempts}</dd></div>}
        {stats && <div><dt>مرات الفوز داخل المحاكي</dt><dd>{stats.wins}</dd></div>}
        {stats && <div><dt>مرات الخسارة داخل المحاكي</dt><dd>{stats.losses}</dd></div>}
      </dl>
      <p className="simulation-caution"><strong>لا تُفسَّر هذه النتيجة كاحتمال شخصي أو توقع لقرعة رسمية.</strong> النسبة المعروضة هي فقط نسبة المقاعد إلى المتقدمين في بيانات موسم سابق، والمحاولة الحالية عشوائية مستقلة.</p>
      <div className="authentic-dua">
        <span>دعاء / ذكر موثّق</span>
        <p className="dua">{dua.text}</p>
        <small>{dua.source}</small>
      </div>
      <button type="button" className="button button-primary" onClick={onRetry}>إعادة المحاولة</button>
      <a className="button button-support" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">🤍 ادعم تطوير الموقع</a>
      <small>الدعم اختياري ولا يؤثر بأي شكل على نتيجة المحاكاة.</small>
    </section>
  );
}
