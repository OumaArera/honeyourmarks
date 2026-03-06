import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isStaff } from "../utils/authUtils";

// ─── Spinner shown while auth state hydrates from localStorage ─────────────
function AuthLoader() {
  return (
    <div className="auth-loader">
      <div className="auth-loader-spinner" />
    </div>
  );
}

// ─── PrivateRoute ──────────────────────────────────────────────────────────
/**
 * @param {"student" | "staff"} requiredGroup
 *   "student" → only role === "student" may enter
 *   "staff"   → teacher / teacher-admin / admin may enter
 */
export default function PrivateRoute({ requiredGroup }) {
  const { isAuthenticated, isReady, user } = useAuth();
  const location = useLocation();

  // Wait until we've checked localStorage before making routing decisions
  if (!isReady) return <AuthLoader />;

  // Not logged in → send to /login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  const userIsStaff = isStaff(user?.role);
  const allowed =
    requiredGroup === "staff"   ?  userIsStaff :
    requiredGroup === "student" ? !userIsStaff :
    true;

  if (!allowed) {
    // Logged in but wrong role → redirect to their own dashboard
    const fallback = userIsStaff ? "/dashboard/staff" : "/dashboard/student";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}