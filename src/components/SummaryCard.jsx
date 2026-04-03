export default function SummaryCard({ label, value, note, accentClass }) {
  return (
    <article className={`summary-card reveal-card ${accentClass || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
