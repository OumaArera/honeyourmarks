// ─── Token Storage Keys ────────────────────────────────────────────────────
const ACCESS_KEY  = "hym_access";
const REFRESH_KEY = "hym_refresh";

// ─── JWT Decode (no library needed) ───────────────────────────────────────
export function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// ─── Token Storage ─────────────────────────────────────────────────────────
export const tokenStorage = {
  setTokens(access, refresh) {
    localStorage.setItem(ACCESS_KEY,  access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  getAccess()   { return localStorage.getItem(ACCESS_KEY); },
  getRefresh()  { return localStorage.getItem(REFRESH_KEY); },
  clear()       {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ─── Expiry Checks ─────────────────────────────────────────────────────────
// Returns true if the token will expire within `bufferSeconds`
export function isTokenExpiringSoon(token, bufferSeconds = 60) {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp - nowSeconds < bufferSeconds;
}

export function isTokenExpired(token) {
  return isTokenExpiringSoon(token, 0);
}

// ─── Role Helpers ──────────────────────────────────────────────────────────
export const ROLES = {
  STUDENT:       "student",
  TEACHER:       "teacher",
  TEACHER_ADMIN: "teacher-admin",
  ADMIN:         "admin",
};

export const STAFF_ROLES = [ROLES.TEACHER, ROLES.TEACHER_ADMIN, ROLES.ADMIN];

export function isStaff(role) {
  return STAFF_ROLES.includes(role);
}

export function getDashboardPath(role) {
  return isStaff(role) ? "/dashboard/staff" : "/dashboard/student";
}