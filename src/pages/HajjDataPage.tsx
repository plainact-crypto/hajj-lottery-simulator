import { Link } from 'react-router-dom';
import { HAJJ_TOURISM_HISTORY, formatNumber, formatRate, selectionRate } from '../data/hajjHistoricalData';

export function HajjDataPage() {
  const maxApplicants = Math.max(...HAJJ_TOURISM_HISTORY.map((season) => season.applicants));

  return (
    <div className="content-page page-container data-page">
      <header className="page-title">
        <span>بيانات تاريخية موثقة</span>
        <h1>إحصاءات الحج السياحي المصري</h1>
      </header>

      <article className="card prose">
        <h2>ما الذي تقيسه هذه الصفحة؟</h2>
        <p>نجمع هنا بيانات منشورة عن مواسم الحج السياحي المصري في صورة موحدة: عدد المتقدمين، عدد المقاعد التي دخلت القرعة، توزيع المستويات، ونسبة الاختيار التاريخية الناتجة عن قسمة المقاعد على المتقدمين.</p>
        <div className="important-note"><strong>مهم:</strong> النسبة التاريخية ليست توقعًا لفرصة شخص بعينه في موسم قادم، ولا تعني أن قواعد كل موسم متطابقة مع الموسم الذي سبقه.</div>
      </article>

      <section className="data-overview-grid" aria-label="ملخص المواسم">
        {HAJJ_TOURISM_HISTORY.map((season) => {
          const rate = selectionRate(season.lotteryPlaces, season.applicants);
          return (
            <article className="card data-summary-card" key={season.gregorian}>
              <span className="data-season">{season.hijri} / {season.gregorian}</span>
              <strong>{formatNumber(season.applicants)}</strong>
              <small>متقدم</small>
              <div className="data-rate">{formatRate(rate)}</div>
              <small>معدل اختيار تاريخي للقرعة</small>
            </article>
          );
        })}
      </section>

      <article className="card prose">
        <h2>تغير عدد المتقدمين عبر المواسم</h2>
        <div className="history-bars" role="img" aria-label="مقارنة عدد المتقدمين للحج السياحي بين 2024 و2025 و2026">
          {HAJJ_TOURISM_HISTORY.map((season) => (
            <div className="history-bar-row" key={season.gregorian}>
              <div className="history-bar-label"><span>{season.gregorian}</span><strong>{formatNumber(season.applicants)}</strong></div>
              <div className="history-bar-track"><span style={{ width: `${(season.applicants / maxApplicants) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <p>الزيادة أو الانخفاض في أعداد المتقدمين لا يكفي وحده لتفسير صعوبة الاختيار؛ يجب قراءته مع عدد المقاعد المخصصة داخل القرعة وتغير مستويات البرامج.</p>
      </article>

      {HAJJ_TOURISM_HISTORY.map((season) => (
        <article className="card prose season-data-card" key={season.gregorian}>
          <h2>{season.hijri} / {season.gregorian}</h2>
          <div className="data-kpis">
            <div><span>المتقدمون</span><strong>{formatNumber(season.applicants)}</strong></div>
            <div><span>مقاعد القرعة</span><strong>{formatNumber(season.lotteryPlaces)}</strong></div>
            <div><span>المعدل التاريخي</span><strong>{formatRate(selectionRate(season.lotteryPlaces, season.applicants))}</strong></div>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>المستوى</th><th>المتقدمون</th><th>المقاعد</th><th>النسبة التاريخية</th></tr></thead>
              <tbody>
                {season.levels.map((level) => (
                  <tr key={level.id}>
                    <td>{level.label}</td>
                    <td>{formatNumber(level.applicants)}</td>
                    <td>{formatNumber(level.places)}</td>
                    <td>{formatRate(selectionRate(level.places, level.applicants))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul>{season.notes.map((note) => <li key={note}>{note}</li>)}</ul>
          <div className="source-box">
            <strong>المصدر:</strong> <a href={season.sourceUrl} target="_blank" rel="noopener noreferrer">{season.sourceName}</a>
            <br /><small>تاريخ المصدر: {season.sourceDate} — مستوى المصدر: {season.sourceTier === 'official' ? 'رسمي' : season.sourceTier === 'government-republished' ? 'إعادة نشر حكومية' : 'صحافة كبرى'}</small>
          </div>
        </article>
      ))}

      <article className="card prose">
        <h2>منهجية التطبيع</h2>
        <p>لا نخلط بين إجمالي التأشيرات السياحية وبين المقاعد التي دخلت القرعة. إذا كان موسم ما يتضمن حصة خارج القرعة، تُستبعد تلك الحصة من حساب معدل الاختيار التاريخي للقرعة. كما لا نملأ أي خانة مفقودة بتخمين غير موثق.</p>
        <p>هذه الصفحة هي بداية قاعدة البيانات التاريخية، وستتوسع فقط عند توفر مصادر يمكن التحقق منها. راجع أيضًا <Link to="/how-it-works">منهجية المحاكي</Link> و<Link to="/official-sources">دليل المصادر الرسمية</Link>.</p>
      </article>
    </div>
  );
}
