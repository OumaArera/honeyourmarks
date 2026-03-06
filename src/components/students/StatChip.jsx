import React from "react";

export default function StatChip({ icon, value, label, color = "#E84A0C" }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
      <span className="text-xl">{icon}</span>
      <span className="font-black text-xl text-white" style={{ textShadow: `0 0 16px ${color}66` }}>{value}</span>
      <span className="text-[10px] text-white/40 tracking-wider uppercase">{label}</span>
    </div>
  );
}