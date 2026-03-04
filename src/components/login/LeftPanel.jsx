// ─── LeftPanel ───────────────────────────────────────────────────────────────
export default function LeftPanel() {
  return (
    <div className="left-panel">
      <a href="/" className="brand-mark">
        <img src="/logo.png" alt="Hone Your Marks" className="brand-logo" />
        <span className="brand-name">Hone Your <em>Marks</em></span>
      </a>

      <div className="left-quote">
        <div className="accent-line" />
        <h2>
          Every great <em>score</em> starts with a single lesson.
        </h2>
        <p>
          A focused learning platform for Kenyan students — built around how
          teachers teach and how students actually learn. Pay per term,
          learn without limits.
        </p>
      </div>

      <div className="left-stats">
        <div className="stat-item">
          <span className="stat-num">47K+</span>
          <span className="stat-label">Students</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">1800+</span>
          <span className="stat-label">Topics</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">KSh 500</span>
          <span className="stat-label">From / week</span>
        </div>
      </div>
    </div>
  );
}