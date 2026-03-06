import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


/**
 * useAuth — consume AuthContext anywhere in the tree.
 *
 * Throws if used outside <AuthProvider> so bugs surface immediately.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}