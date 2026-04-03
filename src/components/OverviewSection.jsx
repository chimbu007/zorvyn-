import SummaryCard from "./SummaryCard";
import BalanceTrendChart from "./BalanceTrendChart";
import CategoryChart from "./CategoryChart";

export default function OverviewSection({
  summaryCards,
  monthlyData,
  weeklyData,
  weeklyComparison,
  trendView,
  onTrendViewChange,
  categoryData,
  categoryView,
  onCategoryViewChange,
  formatCurrency,
  formatCompactCurrency
}) {
  return (
    <section className="section-block" id="overview">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Dashboard overview</p>
          <h2>Overall financial summary</h2>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      <div className="visual-grid">
        <BalanceTrendChart
          data={trendView === "monthly" ? monthlyData : weeklyData}
          weeklyComparison={weeklyComparison}
          trendView={trendView}
          onTrendViewChange={onTrendViewChange}
          formatCurrency={formatCurrency}
        />
        <CategoryChart
          categories={categoryData}
          categoryView={categoryView}
          onCategoryViewChange={onCategoryViewChange}
          formatCurrency={formatCurrency}
          formatCompactCurrency={formatCompactCurrency}
        />
      </div>
    </section>
  );
}
