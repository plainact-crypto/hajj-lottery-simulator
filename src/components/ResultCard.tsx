import { useMemo } from 'react';
import { SUPPORT_URL } from '../config';
import { getRandomAuthenticDua } from '../data/authenticDuas';

interface Props {
  won: boolean;
  firstName: string;
  level: string;
  company: string;
  onRetry: () => void;
}

export function ResultCard({ won, firstName, level, company, onRetry }: Props) {
  const dua = useMemo(() => getRandomAuthenticDua(), []);
  return (
    <section className={`result-card card ${won ? 'winner' : 'not-winner'}`} aria-live="polite">
      <div className="result-symbol" aria-hidden="true">{won ? '✦' : '☾'}</div>
      <span className="result-label">نتيجة المحاكاة</span>
      <h2>{won ? `مبروك يا ${firstName} ✨` : `ربنا يكتبها لك قريبًا يا ${firstName} 🤲`}</h2>
      <p className="result-lead">{won ? 'وقعت عليك القرعة في هذه المحاكاة' : 'لم يقع عليك الاختيار في هذه المحاكاة.'}</p>
      <dl className="result-details">
        <div><dt>مستوى الحج</dt><dd>{level}</dd></div>
        <div><dt>شركة السياحة</dt><dd>{company}</dd></div>
      </dl>
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
