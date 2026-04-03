export default function Sidebar({ role, setRole, darkMode, setDarkMode, roleDescriptions }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <p className="eyebrow">Finance workspace</p>
          <h1>Finora</h1>
          <p className="sidebar__copy">
            A simple personal finance dashboard focused on clarity, not clutter.
          </p>
        </div>

        <nav className="sidebar__nav" aria-label="Dashboard sections">
          <a href="#overview">Overview</a>
          <a href="#transactions">Transactions</a>
          <a href="#insights">Insights</a>
        </nav>
      </div>

      <div className="sidebar__controls">
        <label className="field">
          <span>Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          className="toggle-button"
          type="button"
          onClick={() => setDarkMode((value) => !value)}
        >
          <span>{darkMode ? "Dark mode" : "Light mode"}</span>
          <strong>{darkMode ? "On" : "Off"}</strong>
        </button>

        <p className="sidebar__role-note">{roleDescriptions[role]}</p>
      </div>
    </aside>
  );
}
