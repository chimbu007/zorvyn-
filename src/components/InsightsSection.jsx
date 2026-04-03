export default function InsightsSection({ insights }) {
  return (
    <section className="section-block" id="insights">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Basic spending patterns</h2>
        </div>
      </div>

      <div className="insight-grid">
        {insights.map((insight) => (
          <article className="insight-card reveal-card" key={insight.label}>
            <span className="insight-card__label">{insight.label}</span>
            <strong className="insight-card__value">{insight.value}</strong>
            <p className="insight-card__copy">{insight.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
