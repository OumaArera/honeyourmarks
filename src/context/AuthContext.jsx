import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { authMethod } from "../api/api.service";
import {
  decodeJWT,
  getDashboardPath,
  isTokenExpired,
  isTokenExpiringSoon,
  tokenStorage,
} from "../utils/authUtils";

// ─── Context ───────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

// ─── How many ms before expiry to proactively refresh (5 minutes) ──────────
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

// ─── AuthProvider ──────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);   // decoded JWT payload
  const [accessToken, setAccessToken] = useState(null);
  const [isReady,     setIsReady]     = useState(false);  // hydrated from storage?
  const refreshTimerRef = useRef(null);

  // ── Persist & update state from a fresh token pair ──────────────────────
  const applyTokens = useCallback((access, refresh) => {
    tokenStorage.setTokens(access, refresh);
    const payload = decodeJWT(access);
    setAccessToken(access);
    setUser(payload);
    scheduleRefresh(access, refresh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Schedule a silent refresh before the access token expires ───────────
  const scheduleRefresh = useCallback((access, refresh) => {
    clearTimeout(refreshTimerRef.current);

    const payload   = decodeJWT(access);
    if (!payload?.exp) return;

    const expiresInMs = payload.exp * 1000 - Date.now();
    const delay       = Math.max(expiresInMs - REFRESH_BUFFER_MS, 0);

    refreshTimerRef.current = setTimeout(() => silentRefresh(refresh), delay);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Call the refresh endpoint silently ──────────────────────────────────
  const silentRefresh = useCallback(async (refreshToken) => {
    try {
      const data = await authMethod("auth/token/refresh/", { refresh: refreshToken });
      if (data?.error) { logout(); return; }
      applyTokens(data.access, data.refresh);
    } catch {
      logout();
    }
  }, [applyTokens]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    const storedAccess  = tokenStorage.getAccess();
    const storedRefresh = tokenStorage.getRefresh();

    if (storedAccess && storedRefresh) {
      if (isTokenExpired(storedAccess)) {
        silentRefresh(storedRefresh);
      } else {
        applyTokens(storedAccess, storedRefresh);
      }
    }

    setIsReady(true);
    return () => clearTimeout(refreshTimerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const data = await authMethod("auth/login/", { username, password });

    // authMethod returns { error } on failure rather than throwing.
    // Normalise it into a thrown Error so callers use a simple try/catch.
    if (data?.error) {
      const raw = data.error;
      const message =
        typeof raw === "string"
          ? raw                          // already a plain string
          : raw?.detail                  // { detail: "No active account …" }
            ?? "Invalid credentials. Please try again.";
      throw new Error(message);
    }

    applyTokens(data.access, data.refresh);
    const payload = decodeJWT(data.access);
    return getDashboardPath(payload?.role);
  }, [applyTokens]);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearTimeout(refreshTimerRef.current);
    tokenStorage.clear();
    setAccessToken(null);
    setUser(null);
  }, []);

  // ── Expose a fresh access token (refresh inline if expiring soon) ────────
  const getAccessToken = useCallback(async () => {
    if (!accessToken) return null;
    if (isTokenExpiringSoon(accessToken)) {
      const refresh = tokenStorage.getRefresh();
      if (refresh) await silentRefresh(refresh);
      return tokenStorage.getAccess();
    }
    return accessToken;
  }, [accessToken, silentRefresh]);

  const value = {
    user,
    accessToken,
    isReady,
    isAuthenticated: !!user,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}