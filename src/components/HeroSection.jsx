export default function HeroSection({ monthCount, transactionCount, savingsRate }) {
  return (
    <header className="hero-card">
      <div className="hero-card__orb hero-card__orb--one" aria-hidden="true" />
      <div className="hero-card__orb hero-card__orb--two" aria-hidden="true" />
      <div className="hero-card__content">
        <p className="eyebrow">Financial command center</p>
        <h2>Understand the story behind every dollar.</h2>
        <p>
          Track overall financial summary, explore transaction history, and spot basic spending patterns without any backend complexity.
        </p>
      </div>

      <div className="hero-card__metrics">
        <article>
          <span>Tracked months</span>
          <strong>{monthCount}</strong>
        </article>
        <article>
          <span>Transactions</span>
          <strong>{transactionCount}</strong>
        </article>
        <article>
          <span>Savings rate</span>
          <strong>{savingsRate}%</strong>
        </article>
      </div>
    </header>
  );
}
