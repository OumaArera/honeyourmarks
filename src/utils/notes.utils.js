// ── Token helpers ─────────────────────────────────────────────────────────────
const ACCESS_KEY = "hym_access";

function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch { return null; }
}

export function getAuthorId() {
  try {
    const token = localStorage.getItem(ACCESS_KEY);
    if (!token) return null;
    const payload = decodeJWT(token);
    return payload?.user_id ?? payload?.sub ?? null;
  } catch { return null; }
}

export const inputCls = `w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20
  outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-700/60`.trim();

export const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};