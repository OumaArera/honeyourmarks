import React from "react";
import {  NAV_ITEMS } from "../../data/dashboard.data";;



export default function Sidebar({ active, onNav, collapsed }) {
  return (
    <aside className={`h-full flex flex-col py-6 transition-all duration-300 ${collapsed ? "items-center" : ""}`}
      style={{ background: "rgba(10,16,28,0.95)", borderRight: "1px solid rgba(255,255,255,0.07)" }}>

      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-5 mb-8 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base shrink-0"
          style={{ background: "linear-gradient(135deg,#E84A0C,#c73d09)" }}>H</div>
        {!collapsed && <span className="font-black text-white text-base whitespace-nowrap">Hone <span style={{ color: "#E84A0C" }}>Marks</span></span>}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV_ITEMS.map(({ key, icon, label }) => {
          const isActive = active === key;
          return (
            <button key={key} onClick={() => onNav(key)}
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 font-semibold text-sm
                ${collapsed ? "justify-center p-3" : "px-4 py-3"}
                ${isActive ? "text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}
              style={isActive ? { background: "rgba(232,74,12,0.18)", border: "1px solid rgba(232,74,12,0.35)", color: "#FDF8F2" } : { border: "1px solid transparent" }}>
              <span className="text-lg">{icon}</span>
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#E84A0C" }} />}
            </button>
          );
        })}
      </nav>

      
    </aside>
  );
}