import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ─── DashboardShell ───────────────────────────────────────────────────────
// Wraps both student and staff dashboards with a consistent nav + layout.
export default function DashboardShell({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dash-root">

      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-brand">
          <img src="/logo.png" alt="" className="dash-sidebar-logo" />
          <span className="dash-sidebar-name">HYM</span>
        </div>

        <nav className="dash-nav">
          <NavItem emoji="🏠" label="Home"      active />
          <NavItem emoji="📅" label="Schedule" />
          <NavItem emoji="💬" label="Messages" />
          <NavItem emoji="⚙️" label="Settings" />
        </nav>

        <button className="dash-logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        <header className="dash-header">
          <h2 className="dash-header-title">{title}</h2>
          <div className="dash-header-user">
            <span className="dash-header-username">{user?.username}</span>
            <div className="dash-avatar">{user?.username?.[0]?.toUpperCase() ?? "?"}</div>
          </div>
        </header>

        <div className="dash-content">
          {children}
        </div>
      </main>

    </div>
  );
}

function NavItem({ emoji, label, active }) {
  return (
    <button className={`dash-nav-item${active ? " active" : ""}`}>
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}