export default function CategoryChart({
  categories,
  categoryView,
  onCategoryViewChange,
  formatCurrency,
  formatCompactCurrency
}) {
  if (!categories.length) {
    return <div className="panel panel--empty">No category data available.</div>;
  }

  const colors = ["#ff8f6b", "#4eb89a", "#f1b34c", "#7b8fe8", "#d671a7", "#72b7d8"];
  const total = categories.reduce((sum, item) => sum + item.total, 0);
  let progress = 0;

  const segments = categories.map((item, index) => {
    const start = progress;
    progress += item.total / total;
    const startAngle = start * Math.PI * 2 - Math.PI / 2;
    const endAngle = progress * Math.PI * 2 - Math.PI / 2;
    const radius = 76;
    const center = 100;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = center + Math.cos(startAngle) * radius;
    const y1 = center + Math.sin(startAngle) * radius;
    const x2 = center + Math.cos(endAngle) * radius;
    const y2 = center + Math.sin(endAngle) * radius;

    return {
      ...item,
      color: colors[index % colors.length],
      path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
    };
  });

  return (
    <article className="panel chart-panel">
      <div className="panel__header">
        <div>
          <p className="panel-label">Categorical visualization</p>
          <h3>{categoryView === "expenses" ? "Spending breakdown" : "Savings breakdown"}</h3>
        </div>
        <div className="segmented-control" aria-label="Select category view">
          <button
            className={`segmented-control__button ${categoryView === "expenses" ? "is-active" : ""}`}
            type="button"
            onClick={() => onCategoryViewChange("expenses")}
          >
            Expenses
          </button>
          <button
            className={`segmented-control__button ${categoryView === "savings" ? "is-active" : ""}`}
            type="button"
            onClick={() => onCategoryViewChange("savings")}
          >
            Savings
          </button>
        </div>
      </div>

      <div className="donut-layout">
        <div className="donut-stage">
          <svg
            className="chart-svg"
            viewBox="0 0 200 200"
            role="img"
            aria-label={categoryView === "expenses" ? "Spending categories" : "Savings categories"}
          >
            <circle cx="100" cy="100" r="76" fill="none" stroke="var(--chart-line)" strokeWidth="22" />
            {segments.map((segment) => (
              <path
                key={segment.label}
                d={segment.path}
                fill="none"
                stroke={segment.color}
                strokeWidth="22"
                strokeLinecap="round"
              >
                <title>{`${segment.label}: ${formatCurrency(segment.total)}`}</title>
              </path>
            ))}
            <text x="100" y="92" textAnchor="middle" className="donut-caption">
              {categoryView === "expenses" ? "Spent" : "Saved"}
            </text>
            <text x="100" y="118" textAnchor="middle" className="donut-total">
              {formatCompactCurrency(total)}
            </text>
          </svg>
        </div>

        <div className="legend-list">
          {segments.map((segment) => (
            <div className="legend-item" key={segment.label}>
              <div className="legend-item__label">
                <span className="legend-swatch" style={{ background: segment.color }} />
                <span>{segment.label}</span>
              </div>
              <strong>{Math.round((segment.total / total) * 100)}%</strong>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
