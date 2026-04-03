export default function BalanceTrendChart({
  data,
  weeklyComparison,
  trendView,
  onTrendViewChange,
  formatCurrency
}) {
  if (!data.length) {
    return <div className="panel panel--empty">No trend data available.</div>;
  }

  const width = 680;
  const height = 280;
  const padding = 28;
  const chartValues = data.flatMap((item) => [item.balance, item.savings]);
  const maxValue = Math.max(...chartValues, 1);
  const minValue = Math.min(...chartValues, 0);
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const balanceY = height - padding - ((item.balance - minValue) / range) * (height - padding * 2);
    const savingsY = height - padding - ((item.savings - minValue) / range) * (height - padding * 2);
    return { ...item, x, balanceY, savingsY };
  });

  const balancePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.balanceY}`)
    .join(" ");
  const savingsPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.savingsY}`)
    .join(" ");
  const areaPath = `${balancePath} L ${points.at(-1).x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <article className="panel chart-panel">
      <div className="panel__header">
        <div>
          <p className="panel-label">Time based visualization</p>
          <h3>Balance and savings trend</h3>
        </div>
        <div className="segmented-control" aria-label="Select trend view">
          <button
            className={`segmented-control__button ${trendView === "monthly" ? "is-active" : ""}`}
            type="button"
            onClick={() => onTrendViewChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={`segmented-control__button ${trendView === "weekly" ? "is-active" : ""}`}
            type="button"
            onClick={() => onTrendViewChange("weekly")}
          >
            Weekly
          </button>
        </div>
      </div>

      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Balance trend">
        <defs>
          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="var(--chart-line)"
        />
        <path d={areaPath} fill="url(#trendGradient)" />
        <path d={balancePath} fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
        <path
          d={savingsPath}
          fill="none"
          stroke="var(--accent-alt)"
          strokeWidth="3"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.balanceY} r="5" fill="var(--accent-strong)" />
            <circle cx={point.x} cy={point.savingsY} r="4" fill="var(--accent-alt)" />
            <title>{`${point.label}: Balance ${formatCurrency(point.balance)}, Savings ${formatCurrency(point.savings)}`}</title>
          </g>
        ))}
      </svg>

      <div className="chart-legend">
        <span><i className="legend-dot legend-dot--balance" /> Balance</span>
        <span><i className="legend-dot legend-dot--savings" /> Savings</span>
      </div>

      <div className="chart-labels">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>

      <div className="weekly-compare">
        <article>
          <span>{trendView === "weekly" ? "This week" : "Latest week"}</span>
          <strong>{formatCurrency(weeklyComparison.currentWeekSavings)}</strong>
          <p>Net savings from the latest 7 days.</p>
        </article>
        <article>
          <span>Previous week</span>
          <strong>{formatCurrency(weeklyComparison.previousWeekSavings)}</strong>
          <p>Net savings from the week before.</p>
        </article>
        <article>
          <span>Weekly change</span>
          <strong>
            {weeklyComparison.difference > 0 ? "+" : ""}
            {formatCurrency(weeklyComparison.difference)}
          </strong>
          <p>
            {weeklyComparison.difference >= 0
              ? "Savings improved compared to last week."
              : "Savings slipped compared to last week."}
          </p>
        </article>
      </div>
    </article>
  );
}
