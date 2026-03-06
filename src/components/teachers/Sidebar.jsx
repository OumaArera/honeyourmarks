import React from "react";
import { TEACHER, NAV_ITEMS } from "../../data/teacher.dashboard.data";


export default function Sidebar({ active, onNav, collapsed, onLogout }) {
  return (
    <aside className={`h-full flex flex-col py-6 transition-all duration-300 ${collapsed ? "items-center" : ""}`}
      style={{ background: "rgba(8,14,26,0.97)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Logo */}
      <div className={`flex items-center gap-3 mb-10 ${collapsed ? "justify-center px-2" : "px-6"}`}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
          style={{ background: "linear-gradient(135deg,#0D9488,#0891B2)" }}>H</div>
        {!collapsed && (
          <div>
            <p className="font-black text-white text-sm leading-tight">Hone<span style={{ color: "#0D9488" }}>Marks</span></p>
            <p className="text-white/30 text-[10px] tracking-widest uppercase">Teacher</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {NAV_ITEMS.map(({ key, icon, label }) => {
          const isActive = active === key;
          return (
            <button key={key} onClick={() => onNav(key)}
              className={`flex items-center gap-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${collapsed ? "justify-center p-3" : "px-4 py-3"}`}
              style={isActive
                ? { background: "rgba(13,148,136,0.15)", border: "1px solid rgba(13,148,136,0.3)", color: "#2DD4BF" }
                : { border: "1px solid transparent", color: "rgba(255,255,255,0.35)" }}>
              <span className="text-base font-black" style={isActive ? { color: "#0D9488" } : {}}>{icon}</span>
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
            </button>
          );
        })}
      </nav>

      {/* Teacher card */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: "rgba(13,148,136,0.2)" }}>{TEACHER.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-black truncate">{TEACHER.name}</p>
              <p className="text-white/30 text-[10px] truncate">{TEACHER.school}</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span>↩</span> Logout
          </button>
        </div>
      )}
      {collapsed && (
        <button onClick={onLogout} className="mt-4 p-3 rounded-xl mx-2 transition-all duration-200 hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>↩</button>
      )}
    </aside>
  );
}