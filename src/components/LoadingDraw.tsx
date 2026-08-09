export function LoadingDraw() {
  return (
    <section className="draw-loading card" aria-live="polite" aria-busy="true">
      <div className="orbit" aria-hidden="true"><span>🕋</span></div>
      <h2>جارٍ إجراء المحاكاة...</h2>
      <p>اللهم اكتب لنا زيارة بيتك الحرام</p>
      <div className="progress" aria-hidden="true"><span /></div>
    </section>
  );
}
