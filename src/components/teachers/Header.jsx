import { useState } from "react";
import { TEACHER, STATS, NAV_ITEMS } from "../../data/teacher.dashboard.data";


export default function Header({ active, onToggleSidebar, onLogout }) {
  const current = NAV_ITEMS.find(n => n.key === active);
  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-5 py-4"
      style={{ background: "rgba(8,14,26,0.92)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
      <button onClick={onToggleSidebar}
        className="hidden lg:flex w-9 h-9 rounded-lg items-center justify-center text-sm font-black transition-all hover:opacity-70"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.5)" }}>
        ☰
      </button>

      <div className="flex items-center gap-2.5">
        <span className="font-black text-lg" style={{ color: "#0D9488" }}>{current?.icon}</span>
        <h1 className="font-black text-white text-lg">{current?.label}</h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Pending badge */}
        {STATS.pendingMarking > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <span className="text-red-400 text-sm">⚠</span>
            <span className="font-black text-sm text-red-400">{STATS.pendingMarking}</span>
            <span className="text-[10px] text-red-400/70 font-bold hidden sm:inline">to mark</span>
          </div>
        )}
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ background: "rgba(13,148,136,0.2)", border: "1px solid rgba(13,148,136,0.4)" }}>
          {TEACHER.avatar}
        </div>
        <button onClick={onLogout}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-70"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
          ↩ Logout
        </button>
      </div>
    </header>
  );
}