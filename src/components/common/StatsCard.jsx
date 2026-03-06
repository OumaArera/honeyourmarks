// ─── StatsCard ────────────────────────────────────────────────────────────
export default function StatsCard({ label, value, icon }) {
  return (
    <div className="dash-stat-card">
      <span className="dash-stat-icon">{icon}</span>
      <span className="dash-stat-value">{value}</span>
      <span className="dash-stat-label">{label}</span>
    </div>
  );
}