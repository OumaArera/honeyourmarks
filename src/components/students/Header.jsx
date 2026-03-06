import React from "react";
import { STUDENT, NAV_ITEMS } from "../../data/dashboard.data";

export default function Header({ active, onToggleSidebar, onLogout }) {
  const currentNav = NAV_ITEMS.find(n => n.key === active);
  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-5 py-4"
      style={{ background: "rgba(10,16,28,0.9)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
      <button onClick={onToggleSidebar} className="hidden lg:flex w-9 h-9 rounded-lg items-center justify-center"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
        ☰
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xl">{currentNav?.icon}</span>
        <h1 className="font-black text-white text-lg">{currentNav?.label}</h1>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(232,74,12,0.15)", border: "1px solid rgba(232,74,12,0.3)" }}>
          <span className="text-sm">🔥</span>
          <span className="font-black text-sm" style={{ color: "#f97316" }}>{STUDENT.streak}</span>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ background: "rgba(232,74,12,0.2)", border: "1px solid rgba(232,74,12,0.4)" }}>
          {STUDENT.avatar}
        </div>
        <button onClick={onLogout}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}>
          <span>↩</span> Logout
        </button>
      </div>
    </header>
  );
}