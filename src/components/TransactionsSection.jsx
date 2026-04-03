export default function TransactionsSection({
  role,
  filters,
  setFilters,
  categories,
  transactions,
  onOpenModal,
  formatCurrency,
  formatDate
}) {
  const canEdit = role === "admin";

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="section-block" id="transactions">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Transactions</p>
          <h2>Search, sort, and review activity</h2>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => onOpenModal()}
          disabled={!canEdit}
        >
          Add transaction
        </button>
      </div>

      <article className="panel">
        <div className="filters-grid">
          <label className="field">
            <span>Search</span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search category or note"
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Type</span>
            <select value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="field">
            <span>Sort by</span>
            <select value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value)}>
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
          </label>
        </div>

        {!transactions.length ? (
          <div className="empty-state">
            <h3>No transactions found</h3>
            <p>Try a different filter or add a new transaction in admin mode.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td data-label="Date">{formatDate(transaction.date)}</td>
                    <td data-label="Category">{transaction.category}</td>
                    <td data-label="Type">
                      <span className={`type-pill type-pill--${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td data-label="Amount" className={`amount amount--${transaction.type}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td data-label="Note">{transaction.note}</td>
                    <td data-label="Action">
                      <button
                        className="table-action"
                        type="button"
                        onClick={() => onOpenModal(transaction)}
                        disabled={!canEdit}
                      >
                        {canEdit ? "Edit" : "Viewer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
