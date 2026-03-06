import React from "react";

export default function StatCard({ icon, value, label, sub, color = "#0D9488", urgent }) {
  return (
    <div className="relative rounded-2xl p-5 flex flex-col gap-2 overflow-hidden group transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${urgent ? color : "rgba(255,255,255,0.07)"}` }}>
      {urgent && <div className="absolute inset-0 animate-pulse rounded-2xl" style={{ background: `${color}08` }} />}
      <div className="relative z-10 flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          {icon}
        </div>
        {urgent && <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full animate-pulse"
          style={{ background: `${color}25`, color }}>urgent</span>}
      </div>
      <div className="relative z-10">
        <p className="font-black text-3xl text-white leading-none">{value}</p>
        <p className="text-white/50 text-xs font-semibold mt-1 tracking-wide">{label}</p>
        {sub && <p className="text-[10px] mt-1" style={{ color }}>{sub}</p>}
      </div>
    </div>
  );
}