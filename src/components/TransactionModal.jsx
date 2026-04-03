import { useEffect, useState } from "react";

const emptyDraft = {
  id: "",
  date: "2026-04-02",
  amount: "",
  category: "",
  type: "expense",
  note: ""
};

export default function TransactionModal({ open, role, selectedTransaction, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    if (!open) return;
    if (selectedTransaction) {
      setDraft({
        ...selectedTransaction,
        amount: String(selectedTransaction.amount)
      });
      return;
    }
    setDraft(emptyDraft);
  }, [open, selectedTransaction]);

  if (!open) return null;

  const isAdmin = role === "admin";
  const isEditing = Boolean(selectedTransaction);

  const handleChange = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    onSave({
      ...draft,
      id: draft.id || Date.now(),
      amount: Number(draft.amount)
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-card__header">
          <div>
            <p className="panel-label">Admin editor</p>
            <h3>{isEditing ? "Edit transaction" : "Add transaction"}</h3>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="modal-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Date</span>
            <input
              type="date"
              value={draft.date}
              onChange={(event) => handleChange("date", event.target.value)}
              disabled={!isAdmin}
              required
            />
          </label>

          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.amount}
              onChange={(event) => handleChange("amount", event.target.value)}
              disabled={!isAdmin}
              required
            />
          </label>

          <label className="field">
            <span>Category</span>
            <input
              type="text"
              value={draft.category}
              onChange={(event) => handleChange("category", event.target.value)}
              disabled={!isAdmin}
              required
            />
          </label>

          <label className="field">
            <span>Type</span>
            <select
              value={draft.type}
              onChange={(event) => handleChange("type", event.target.value)}
              disabled={!isAdmin}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label className="field field--full">
            <span>Note</span>
            <input
              type="text"
              value={draft.note}
              onChange={(event) => handleChange("note", event.target.value)}
              disabled={!isAdmin}
              required
            />
          </label>

          <div className="modal-actions">
            {isEditing ? (
              <button
                className="ghost-button"
                type="button"
                onClick={() => onDelete(selectedTransaction.id)}
                disabled={!isAdmin}
              >
                Delete
              </button>
            ) : (
              <span className="helper-text">Use admin mode to add or edit data.</span>
            )}
            <button className="primary-button" type="submit" disabled={!isAdmin}>
              Save transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
